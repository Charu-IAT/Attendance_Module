package com.example.attendance_module.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;


@Configuration
public class SwaggerConfig {
    @Bean
    public OpenAPI customOpenAPI(){
        final String securitySchemeName="bearerAuth";
        return new OpenAPI()
        .info(new Info()
                .title("Attendance Module")
                .version("1.0")
                .description("For marking Attendance for Students"))

        .addSecurityItem(new SecurityRequirement()
                .addList(securitySchemeName))

        .components(new Components()
                .addSecuritySchemes(securitySchemeName, new SecurityScheme()
                                        .name(securitySchemeName)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")));
    }
}
