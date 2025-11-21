+function ($) {
    'use strict';

    // CLASS DEFINITION
    // ======================

    var LadbTabCostAnalysis = function (element, options, dialog) {
        LadbAbstractTab.call(this, element, options, dialog);

        this.$btnCalculate = $('#ladb_btn_calculate_cost', this.$element);
        this.$loadingMessage = $('#ladb_loading_message', this.$element);
        this.$resultsContainer = $('#ladb_cost_analysis_results', this.$element);
        this.$errorMessage = $('#ladb_error_message', this.$element);

        this.calculating = false;
        this.hideZeroCost = true; // Default to hiding zero-cost items
        this.currentResult = null; // Store current result for modals
    };
    LadbTabCostAnalysis.prototype = Object.create(LadbAbstractTab.prototype);

    LadbTabCostAnalysis.DEFAULTS = {};

    LadbTabCostAnalysis.prototype.bind = function () {
        LadbAbstractTab.prototype.bind.call(this);

        const that = this;

        // Bind calculate button
        this.$btnCalculate.on('click', function () {
            that.calculateCost();
            this.blur();
        });

        // Close modal on overlay click
        $(document).on('click', '.ladb-cost-modal-overlay', function (e) {
            if (e.target === this) {
                that.closeModal();
            }
        });

        // Close modal on Escape key
        $(document).on('keydown', function (e) {
            if (e.key === 'Escape' && $('.ladb-cost-modal-overlay').length) {
                that.closeModal();
            }
        });
    };

    LadbTabCostAnalysis.prototype.init = function (initializedCallback) {
        LadbAbstractTab.prototype.init.call(this, initializedCallback);
    };

    // Calculate Cost

    LadbTabCostAnalysis.prototype.calculateCost = function () {
        const that = this;

        if (this.calculating) {
            return;
        }

        this.calculating = true;

        // Show loading, hide results and errors
        this.$btnCalculate.prop('disabled', true);
        this.$loadingMessage.show();
        this.$resultsContainer.html('');
        this.$errorMessage.hide();

        // Get project info from inputs
        const projectName = $('#ladb_project_name', this.$element).val() || 'Untitled Project';
        const clientName = $('#ladb_client_name', this.$element).val() || 'Unknown Client';
        const wastePercentage = parseFloat($('#ladb_waste_percentage', this.$element).val()) || 0.15;

        // Safety check: ensure rubyCallCommand is available
        if (typeof rubyCallCommand === 'undefined') {
            that.showError('Error: rubyCallCommand is not defined. Please restart SketchUp.');
            that.calculating = false;
            that.$btnCalculate.prop('disabled', false);
            that.$loadingMessage.hide();
            return;
        }

        rubyCallCommand('cost_analysis_calculate', {
            project_name: projectName,
            client_name: clientName,
            waste_percentage: wastePercentage
        }, function (response) {

            that.calculating = false;
            that.$btnCalculate.prop('disabled', false);
            that.$loadingMessage.hide();

            if (response.errors && response.errors.length > 0) {
                that.showError(response.errors.join('<br>'));
                return;
            }

            if (response.result) {
                that.currentResult = response.result;
                that.displayResults(response.result);
            } else {
                that.showError('No results returned from API');
            }

        });
    };

    LadbTabCostAnalysis.prototype.showError = function (message) {
        this.$errorMessage.html('<strong>Error:</strong> ' + message).show();
    };

    LadbTabCostAnalysis.prototype.displayResults = function (result) {
        const that = this;

        // Parse the result data
        const financialSummary = result.financialSummary || {};
        const costs = result.costs || {};
        const project = result.project || {};

        // Build HTML for results
        let html = '<div class="ladb-results-panel">';

        // Project Info
        html += '<div class="ladb-project-info panel panel-default">';
        html += '<div class="panel-heading"><strong>' + i18next.t('tab.costanalysis.project_information') + '</strong></div>';
        html += '<div class="panel-body">';
        html += '<p><strong>' + i18next.t('default.project') + ':</strong> ' + (project.name || 'N/A') + '</p>';
        html += '<p><strong>' + i18next.t('default.client') + ':</strong> ' + (project.client || 'N/A') + '</p>';
        html += '<p><strong>' + i18next.t('default.date') + ':</strong> ' + (project.date || 'N/A') + '</p>';
        html += '</div></div>';

        // Quick Summary Bar
        html += '<div class="ladb-quick-summary-bar" style="display: flex; justify-content: space-around; padding: 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; margin-bottom: 20px; color: white;">';
        html += '<div style="text-align: center;"><div style="font-size: 12px; opacity: 0.9;">' + i18next.t('tab.costanalysis.materials') + '</div><div style="font-size: 20px; font-weight: bold;">' + that.formatCurrency(costs.material ? costs.material.totalCost : 0) + '</div></div>';
        html += '<div style="text-align: center;"><div style="font-size: 12px; opacity: 0.9;">' + i18next.t('tab.costanalysis.fittings') + '</div><div style="font-size: 20px; font-weight: bold;">' + that.formatCurrency(costs.fittings ? costs.fittings.totalCost : 0) + '</div></div>';
        html += '<div style="text-align: center;"><div style="font-size: 12px; opacity: 0.9;">' + i18next.t('tab.costanalysis.final_price') + '</div><div style="font-size: 24px; font-weight: bold;">' + that.formatCurrency(financialSummary.finalPrice || 0) + '</div></div>';
        html += '</div>';

        // Zero Cost Filter Toggle
        html += '<div style="margin-bottom: 15px; text-align: right;">';
        html += '<label style="cursor: pointer; user-select: none;">';
        html += '<input type="checkbox" id="ladb_hide_zero_cost" ' + (that.hideZeroCost ? 'checked' : '') + '> ';
        html += i18next.t('tab.costanalysis.hide_zero_cost');
        html += '</label>';
        html += '</div>';

        // Cost Breakdown - Category Cards
        html += '<div class="ladb-cost-breakdown">';
        html += '<h3>' + i18next.t('tab.costanalysis.cost_breakdown') + '</h3>';
        html += '<div class="ladb-category-cards" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">';
        
        const categories = [
            { key: 'material', name: i18next.t('tab.costanalysis.materials'), icon: 'ladb-lexacut-icon-materials' },
            { key: 'boreshKari', name: i18next.t('tab.costanalysis.boresh_kari'), icon: 'ladb-lexacut-icon-cuttingdiagram' },
            { key: 'cnc', name: i18next.t('tab.costanalysis.cnc'), icon: 'ladb-lexacut-icon-cutlist' },
            { key: 'navarShiar', name: i18next.t('tab.costanalysis.edge_banding'), icon: 'ladb-lexacut-icon-edge' },
            { key: 'fittings', name: i18next.t('tab.costanalysis.fittings'), icon: 'ladb-lexacut-icon-hardware' },
            { key: 'painting', name: i18next.t('tab.costanalysis.painting'), icon: 'ladb-lexacut-icon-paint' },
            { key: 'plate', name: i18next.t('tab.costanalysis.plate'), icon: 'ladb-lexacut-icon-sheet' },
            { key: 'woodTools', name: i18next.t('tab.costanalysis.wood_tools'), icon: 'ladb-lexacut-icon-tools' }
        ];

        categories.forEach(function(cat) {
            const categoryData = costs[cat.key];
            if (categoryData && categoryData.totalCost > 0) {
                html += '<div class="ladb-category-card" data-category="' + cat.key + '" style="background: #f8f9fa; border: 2px solid #dee2e6; border-radius: 8px; padding: 15px; cursor: pointer; transition: all 0.2s;">';
                html += '<div style="display: flex; align-items: center; margin-bottom: 10px;"><i class="' + cat.icon + '" style="font-size: 20px; margin-right: 8px;"></i><span style="font-weight: 600;">' + cat.name + '</span></div>';
                html += '<div style="font-size: 20px; font-weight: bold; color: #007bff; margin-bottom: 5px;">' + that.formatCurrency(categoryData.totalCost) + '</div>';
                if (categoryData.items && categoryData.items.length > 0) {
                    html += '<div style="font-size: 12px; color: #6c757d;">' + i18next.t('tab.costanalysis.click_for_details') + '</div>';
                }
                html += '</div>';
            }
        });

        html += '</div>';
        html += '</div>';

        // Financial Summary with Collapsible Overheads
        if (financialSummary) {
            html += '<div class="ladb-financial-summary panel panel-default">';
            html += '<div class="panel-heading"><strong>' + i18next.t('tab.costanalysis.financial_summary') + '</strong></div>';
            html += '<div class="panel-body">';
            html += '<table class="table table-bordered">';
            html += '<tbody>';
            html += '<tr><td><strong>' + i18next.t('tab.costanalysis.subtotal') + '</strong></td><td><strong>' + that.formatCurrency(financialSummary.subtotal || 0) + '</strong></td></tr>';
            
            if (financialSummary.overheads) {
                // Collapsible Overheads Row
                html += '<tr class="ladb-overhead-header" style="cursor: pointer; background-color: #f5f5f5;">';
                html += '<td><strong id="ladb_overhead_toggle"><i class="ladb-lexacut-icon-expand" style="margin-right: 5px;"></i>' + i18next.t('tab.costanalysis.overheads') + '</strong></td>';
                html += '<td><strong>' + that.formatCurrency(financialSummary.overheads.totalOverheads || 0) + '</strong></td>';
                html += '</tr>';
                
                // Collapsible Overhead Details (hidden by default)
                html += '<tr class="ladb-overhead-details" style="display: none;"><td colspan="2">';
                html += '<table class="table table-condensed" style="margin: 0; background: white;">';
                html += '<tr><td style="padding-left: 30px;">' + i18next.t('tab.costanalysis.overhead_1') + '</td><td>' + that.formatCurrency(financialSummary.overheads.overhead1 || 0) + '</td></tr>';
                html += '<tr><td style="padding-left: 30px;">' + i18next.t('tab.costanalysis.overhead_2') + '</td><td>' + that.formatCurrency(financialSummary.overheads.overhead2 || 0) + '</td></tr>';
                html += '<tr><td style="padding-left: 30px;">' + i18next.t('tab.costanalysis.overhead_3') + '</td><td>' + that.formatCurrency(financialSummary.overheads.overhead3 || 0) + '</td></tr>';
                html += '<tr><td style="padding-left: 30px;">' + i18next.t('tab.costanalysis.overhead_4') + '</td><td>' + that.formatCurrency(financialSummary.overheads.overhead4 || 0) + '</td></tr>';
                html += '<tr><td style="padding-left: 30px;">' + i18next.t('tab.costanalysis.contingency') + '</td><td>' + that.formatCurrency(financialSummary.overheads.contingency || 0) + '</td></tr>';
                html += '</table>';
                html += '</td></tr>';
            }
            
            html += '<tr><td><strong>' + i18next.t('tab.costanalysis.total_with_overheads') + '</strong></td><td><strong>' + that.formatCurrency(financialSummary.totalWithOverheads || 0) + '</strong></td></tr>';
            html += '<tr><td>' + i18next.t('tab.costanalysis.profit') + ' (22%)</td><td>' + that.formatCurrency(financialSummary.profitAmount || 0) + '</td></tr>';
            html += '<tr class="success"><td><strong>' + i18next.t('tab.costanalysis.final_price') + '</strong></td><td><strong>' + that.formatCurrency(financialSummary.finalPrice || 0) + '</strong></td></tr>';
            html += '</tbody>';
            html += '</table>';
            html += '</div></div>';
        }

        html += '</div>';

        this.$resultsContainer.html(html);

        // Bind events
        $('.ladb-category-card').on('click', function() {
            const categoryKey = $(this).data('category');
            that.showCategoryModal(categoryKey, costs[categoryKey]);
        });

        $('.ladb-overhead-header').on('click', function() {
            $('.ladb-overhead-details').toggle();
            const $icon = $('#ladb_overhead_toggle i');
            if ($('.ladb-overhead-details').is(':visible')) {
                $icon.removeClass('ladb-lexacut-icon-expand').addClass('ladb-lexacut-icon-collapse');
            } else {
                $icon.removeClass('ladb-lexacut-icon-collapse').addClass('ladb-lexacut-icon-expand');
            }
        });

        $('#ladb_hide_zero_cost').on('change', function() {
            that.hideZeroCost = $(this).is(':checked');
        });
    };

    LadbTabCostAnalysis.prototype.showCategoryModal = function(categoryKey, categoryData) {
        const that = this;
        
        if (!categoryData || !categoryData.items || categoryData.items.length === 0) {
            return;
        }

        // Get category name and icon
        const categoryNames = {
            'material': { name: i18next.t('tab.costanalysis.materials'), icon: 'ladb-lexacut-icon-materials', color: '#007bff' },
            'boreshKari': { name: i18next.t('tab.costanalysis.boresh_kari'), icon: 'ladb-lexacut-icon-cuttingdiagram', color: '#6610f2' },
            'cnc': { name: i18next.t('tab.costanalysis.cnc'), icon: 'ladb-lexacut-icon-cutlist', color: '#6f42c1' },
            'navarShiar': { name: i18next.t('tab.costanalysis.edge_banding'), icon: 'ladb-lexacut-icon-edge', color: '#e83e8c' },
            'fittings': { name: i18next.t('tab.costanalysis.fittings'), icon: 'ladb-lexacut-icon-hardware', color: '#fd7e14' },
            'painting': { name: i18next.t('tab.costanalysis.painting'), icon: 'ladb-lexacut-icon-paint', color: '#20c997' },
            'plate': { name: i18next.t('tab.costanalysis.plate'), icon: 'ladb-lexacut-icon-sheet', color: '#17a2b8' },
            'woodTools': { name: i18next.t('tab.costanalysis.wood_tools'), icon: 'ladb-lexacut-icon-tools', color: '#28a745' }
        };

        const category = categoryNames[categoryKey] || { name: categoryKey, icon: 'ladb-lexacut-icon-info', color: '#6c757d' };

        // Filter items based on hideZeroCost setting
        const items = categoryData.items.filter(function(item) {
            if (that.hideZeroCost) {
                return (item.cost || 0) > 0 || (item.quantity || 0) > 0;
            }
            return true;
        });

        if (items.length === 0) {
            return;
        }

        // Build modal HTML
        let html = '<div class="ladb-cost-modal-overlay" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 20px;">';
        html += '<div class="ladb-cost-modal" style="background: white; border-radius: 8px; max-width: 900px; width: 100%; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">';
        
        // Header
        html += '<div class="ladb-cost-modal-header" style="display: flex; align-items: center; justify-content: space-between; padding: 20px; border-bottom: 1px solid #dee2e6;">';
        html += '<div style="display: flex; align-items: center; gap: 15px;">';
        html += '<div style="background: ' + category.color + '; padding: 12px; border-radius: 8px; color: white;"><i class="' + category.icon + '" style="font-size: 24px;"></i></div>';
        html += '<div><h2 style="margin: 0; font-size: 24px; font-weight: bold;">' + category.name + ' ' + i18next.t('tab.costanalysis.details') + '</h2>';
        html += '<p style="margin: 0; color: #6c757d; font-size: 14px;">' + i18next.t('tab.costanalysis.description') + ' ' + i18next.t('tab.costanalysis.cost') + '</p></div>';
        html += '</div>';
        html += '<button class="ladb-modal-close" style="background: none; border: none; font-size: 24px; cursor: pointer; padding: 5px 10px; color: #6c757d; line-height: 1;">&times;</button>';
        html += '</div>';

        // Summary Card
        html += '<div class="ladb-cost-modal-summary" style="margin: 20px; padding: 20px; background: linear-gradient(135deg, ' + category.color + '33, ' + category.color + '11); border: 1px solid ' + category.color + '44; border-radius: 8px;">';
        html += '<div style="display: flex; justify-content: space-between; align-items: center;">';
        html += '<div><p style="margin: 0; font-size: 14px; color: #6c757d;">' + i18next.t('tab.costanalysis.total') + ' ' + category.name + ' ' + i18next.t('tab.costanalysis.cost') + '</p>';
        html += '<p style="margin: 5px 0 0 0; font-size: 32px; font-weight: bold; color: ' + category.color + ';">' + that.formatCurrency(categoryData.totalCost) + '</p></div>';
        html += '<div style="text-align: right;"><p style="margin: 0; font-size: 14px; color: #6c757d;">' + i18next.t('tab.costanalysis.item_count') + '</p>';
        html += '<p style="margin: 5px 0 0 0; font-size: 32px; font-weight: bold;">' + items.length + '</p></div>';
        html += '</div>';
        html += '</div>';

        // Scrollable Items List
        html += '<div class="ladb-cost-modal-body" style="flex: 1; overflow-y: auto; padding: 0 20px 20px 20px;">';
        html += '<div style="display: grid; gap: 12px;">';

        items.forEach(function(item, index) {
            html += '<div class="ladb-cost-modal-item" style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 15px; transition: all 0.2s;" onmouseover="this.style.borderColor=\'' + category.color + '\'" onmouseout="this.style.borderColor=\'#dee2e6\'">';
            
            // Item header
            html += '<div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">';
            html += '<div style="flex: 1;"><h3 style="margin: 0 0 5px 0; font-size: 16px; font-weight: 600;">' + (item.description || item.code || 'Item ' + (index + 1)) + '</h3>';
            if (item.code) {
                html += '<p style="margin: 0; font-size: 12px; color: #6c757d; font-family: monospace;">' + item.code + '</p>';
            }
            html += '</div>';
            html += '<div style="text-align: right;"><p style="margin: 0; font-size: 20px; font-weight: bold; color: ' + category.color + ';">' + that.formatCurrency(item.cost || 0) + '</p></div>';
            html += '</div>';

            // Item details grid
            html += '<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; padding-top: 10px; border-top: 1px solid #dee2e6;">';
            html += '<div><p style="margin: 0; font-size: 11px; color: #6c757d; text-transform: uppercase;">' + i18next.t('tab.costanalysis.quantity') + '</p>';
            html += '<p style="margin: 3px 0 0 0; font-weight: 600;">' + (item.quantity || 0).toLocaleString('en-US') + ' ' + (item.unit || '') + '</p></div>';
            
            if ((item.cost || 0) > 0 && (item.quantity || 0) > 0) {
                const unitPrice = item.cost / item.quantity;
                html += '<div><p style="margin: 0; font-size: 11px; color: #6c757d; text-transform: uppercase;">' + i18next.t('tab.costanalysis.unit_price') + '</p>';
                html += '<p style="margin: 3px 0 0 0; font-weight: 600;">' + that.formatCurrency(unitPrice) + '</p></div>';
            } else {
                html += '<div></div>';
            }
            
            html += '<div><p style="margin: 0; font-size: 11px; color: #6c757d; text-transform: uppercase;">' + i18next.t('tab.costanalysis.total') + '</p>';
            html += '<p style="margin: 3px 0 0 0; font-weight: 600;">' + that.formatCurrency(item.cost || 0) + '</p></div>';
            html += '</div>';

            html += '</div>';
        });

        html += '</div>';
        html += '</div>';

        // Footer
        html += '<div class="ladb-cost-modal-footer" style="padding: 20px; border-top: 1px solid #dee2e6; background: #f8f9fa; display: flex; gap: 10px; justify-content: flex-end;">';
        html += '<button class="ladb-modal-close btn btn-primary" style="padding: 10px 20px;">' + i18next.t('tab.costanalysis.close') + '</button>';
        html += '</div>';

        html += '</div>';
        html += '</div>';

        // Append to body
        $('body').append(html);

        // Bind close events
        $('.ladb-modal-close').on('click', function() {
            that.closeModal();
        });
    };

    LadbTabCostAnalysis.prototype.closeModal = function() {
        $('.ladb-cost-modal-overlay').remove();
    };

    LadbTabCostAnalysis.prototype.formatCurrency = function (amount) {
        // Format as Iranian Rial with Western numerals
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount) + ' Rial';
    };

    // PLUGIN DEFINITION
    // =======================

    function Plugin(option, params) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('ladb.tab.costanalysis');
            var options = $.extend({}, LadbTabCostAnalysis.DEFAULTS, $this.data(), typeof option === 'object' && option);

            if (!data) {
                if (undefined === options.dialog) {
                    throw 'dialog option is mandatory.';
                }
                $this.data('ladb.tab.costanalysis', (data = new LadbTabCostAnalysis(this, options, options.dialog)));
            }
            if (typeof option === 'string') {
                data[option].apply(data, Array.isArray(params) ? params : [params]);
            } else {
                data.init(option.initializedCallback);
            }
        });
    }

    var old = $.fn.ladbTabCostanalysis;

    $.fn.ladbTabCostanalysis = Plugin;
    $.fn.ladbTabCostanalysis.Constructor = LadbTabCostAnalysis;

    // NO CONFLICT
    // =================

    $.fn.ladbTabCostanalysis.noConflict = function () {
        $.fn.ladbTabCostanalysis = old;
        return this;
    };

}(jQuery);
