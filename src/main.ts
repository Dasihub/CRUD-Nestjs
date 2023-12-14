import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'

const bootstrap = async () => {
	try {
		const app = await NestFactory.create(AppModule)
		const PORT = process.env.PORT

		app.setGlobalPrefix('api')
		app.useGlobalPipes(new ValidationPipe())

		const config = new DocumentBuilder()
			.setTitle('CRUD приложение')
			.setDescription('CRUD приложение на Nestjs')
			.setContact('Dastan', 'https://github.com/Dasihub', 'dasihub02@gmail.com')
			.setVersion('1.0.0')
			.addBearerAuth()
			.build()

		const document = SwaggerModule.createDocument(app, config)
		SwaggerModule.setup('api/swagger', app, document)

		await app.listen(PORT, () => console.log(`Server is working in port ${PORT}`))
	} catch (e) {
		console.log(e)
	}
}
bootstrap()
