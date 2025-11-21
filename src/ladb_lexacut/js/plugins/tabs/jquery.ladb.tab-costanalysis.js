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
        html += '<div class="ladb-project-info">';
        html += '<h3>' + i18next.t('tab.costanalysis.project_information') + '</h3>';
        html += '<p><strong>' + i18next.t('default.project') + ':</strong> ' + (project.name || 'N/A') + '</p>';
        html += '<p><strong>' + i18next.t('default.client') + ':</strong> ' + (project.client || 'N/A') + '</p>';
        html += '<p><strong>' + i18next.t('default.date') + ':</strong> ' + (project.date || 'N/A') + '</p>';
        html += '</div>';

        // Cost Breakdown
        html += '<div class="ladb-cost-breakdown">';
        html += '<h3>' + i18next.t('tab.costanalysis.cost_breakdown') + '</h3>';
        html += '<table class="table table-striped">';
        html += '<thead><tr><th>Category</th><th>Cost</th></tr></thead>';
        html += '<tbody>';
        html += '<tr><td>' + i18next.t('tab.costanalysis.materials') + '</td><td>' + that.formatCurrency(costs.material ? costs.material.totalCost : 0) + '</td></tr>';
        html += '<tr><td>' + i18next.t('tab.costanalysis.cnc') + '</td><td>' + that.formatCurrency(costs.cnc ? costs.cnc.totalCost : 0) + '</td></tr>';
        html += '<tr><td>' + i18next.t('tab.costanalysis.edge_banding') + '</td><td>' + that.formatCurrency(costs.navarShiar ? costs.navarShiar.totalCost : 0) + '</td></tr>';
        html += '<tr><td>' + i18next.t('tab.costanalysis.fittings') + '</td><td>' + that.formatCurrency(costs.fittings ? costs.fittings.totalCost : 0) + '</td></tr>';
        html += '</tbody>';
        html += '</table>';
        html += '</div>';

        // Financial Summary
        if (financialSummary) {
            html += '<div class="ladb-financial-summary">';
            html += '<h3>' + i18next.t('tab.costanalysis.financial_summary') + '</h3>';
            html += '<table class="table table-bordered">';
            html += '<tbody>';
            html += '<tr><td><strong>' + i18next.t('tab.costanalysis.subtotal') + '</strong></td><td><strong>' + that.formatCurrency(financialSummary.subtotal || 0) + '</strong></td></tr>';
            
            if (financialSummary.overheads) {
                html += '<tr><td>' + i18next.t('tab.costanalysis.overheads') + '</td><td>' + that.formatCurrency(financialSummary.overheads.totalOverheads || 0) + '</td></tr>';
            }
            
            html += '<tr><td><strong>' + i18next.t('tab.costanalysis.total_with_overheads') + '</strong></td><td><strong>' + that.formatCurrency(financialSummary.totalWithOverheads || 0) + '</strong></td></tr>';
            html += '<tr><td>' + i18next.t('tab.costanalysis.profit') + '</td><td>' + that.formatCurrency(financialSummary.profitAmount || 0) + '</td></tr>';
            html += '<tr class="success"><td><strong>' + i18next.t('tab.costanalysis.final_price') + '</strong></td><td><strong>' + that.formatCurrency(financialSummary.finalPrice || 0) + '</strong></td></tr>';
            html += '</tbody>';
            html += '</table>';
            html += '</div>';
        }

        html += '</div>';

        this.$resultsContainer.html(html);
    };

    LadbTabCostAnalysis.prototype.formatCurrency = function (amount) {
        // Format as Iranian Rial
        return new Intl.NumberFormat('fa-IR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount) + ' ریال';
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

