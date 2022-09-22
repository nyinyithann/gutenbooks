#!/bin/bash
while true; do
    IFS= read -rsn1 char
    INPUT=$INPUT$char
    echo $INPUT
    curl --silent --request GET 'http://192.168.1.133:9200/guten_alpah/_search' --header 'Content-Type: application/json' --data-raw '{
"size": 5,
"query": {
"multi_match": {
"query": "'"$INPUT"'",
"type": "bool_prefix",
"fields": [
"title",
"title._2gram",
"title._3gram",
"authors.name"
]
}
}
}' | jq .hits.hits | jq '.[]._source.title'
done

curl --silent --request GET 'http://192.168.1.133:9200/guten_alpah/_search' --header 'Content-Type: application/json' --data-raw '{
"size": 5,
"query": {
"multi_match": {
"query": "Gray",
"type": "bool_prefix",
"fields": [
"title",
"title._2gram",
"title._3gram",
"authors.name"
]
}
}
}' | jq .hits.hits | jq '.[]._source.title'
