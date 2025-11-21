"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _core = require("@nestjs/core");
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _appmodule = require("./app.module");
async function bootstrap() {
    const app = await _core.NestFactory.create(_appmodule.AppModule);
    // Enable CORS for SketchUp extension
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true
    });
    // Enable validation
    app.useGlobalPipes(new _common.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true
    }));
    // Setup Swagger documentation
    const config = new _swagger.DocumentBuilder().setTitle('LexaCut Cost Calculation API').setDescription('API for calculating woodworking project costs with dynamic pricing management').setVersion('1.0.0').addTag('Cost Calculation', 'Calculate project costs from CSV or JSON data').addTag('Materials Management', 'CRUD operations for materials and pricing').addTag('Edge Banding Management', 'CRUD operations for edge banding types').addTag('CNC Operations Management', 'CRUD operations for CNC operations').addTag('Fittings Management', 'CRUD operations for fittings catalog').addTag('Pricing Configuration', 'Manage overhead percentages and profit margins').build();
    const document = _swagger.SwaggerModule.createDocument(app, config);
    _swagger.SwaggerModule.setup('api/docs', app, document);
    const port = process.env.PORT || 4492;
    await app.listen(port);
    console.log(`🚀 Application is running on: http://localhost:${port}`);
    console.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
}
bootstrap();

//# sourceMappingURL=main.js.map