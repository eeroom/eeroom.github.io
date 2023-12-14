# https://hub.docker.com/_/microsoft-dotnet-core
FROM microsoft/aspnetcore:2.0
WORKDIR /app

# copy csproj and restore as distinct layers

# copy everything else and build app
COPY . .

# final stage/image
expose 80

ENTRYPOINT ["dotnet", "Azeroth.Klz.dll"]