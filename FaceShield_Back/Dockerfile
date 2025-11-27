FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Copiar apenas o necessário
COPY pom.xml .
COPY mvnw .
RUN chmod +x ./mvnw

# Instalar Maven wrapper se não existir
RUN ./mvnw wrapper:wrapper -Dmaven=3.8.1 || true

# Baixar dependências
RUN ./mvnw dependency:go-offline -B

# Copiar código fonte
COPY src ./src

# Compilar
RUN ./mvnw clean package -DskipTests

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "target/faceshield-0.0.1-SNAPSHOT.jar"]