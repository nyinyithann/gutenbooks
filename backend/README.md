# Backend Flow

1. Run fetch.exe to download zip file and unzip it - zip file url and location to unzip are provided in settings.json. fetch.exe will update "latest_unzip_path" in settings.json and the value must be used with other exes (pindex.exe, sindex.exe, server.exe) 
2. Run pindex.exe or sindex.exe to parse downloaded rdf files into json and index to ElasticSearch. Use pindex.exe if having multiple cores or use sindex.exe if having only one core.
    ```./pindex.exe -url "http://localhost:9200/" -index-name "gutenbook"```
3. Run server.exe to serve APIs locally. Or run scripts/deploy.sh on production.
