import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Получение списка статей с фильтрацией по категориям и тегам
    Args: event с httpMethod (GET), queryStringParameters (category, tags)
    Returns: HTTP response с JSON массивом статей
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    
    params = event.get('queryStringParameters') or {}
    category = params.get('category')
    tags_param = params.get('tags')
    
    query = '''
        SELECT DISTINCT
            a.id, a.title, a.excerpt, a.date, a.category, a.read_time, a.author,
            ARRAY_AGG(DISTINCT t.name) as tags
        FROM articles a
        LEFT JOIN article_tags at ON a.id = at.article_id
        LEFT JOIN tags t ON at.tag_id = t.id
    '''
    
    conditions = []
    if category and category != 'Все':
        conditions.append(f"a.category = '{category}'")
    
    if tags_param:
        tags_list = tags_param.split(',')
        tags_escaped = [f"'{tag.strip()}'" for tag in tags_list]
        conditions.append(f"t.name IN ({','.join(tags_escaped)})")
    
    if conditions:
        query += ' WHERE ' + ' AND '.join(conditions)
    
    query += ' GROUP BY a.id, a.title, a.excerpt, a.date, a.category, a.read_time, a.author ORDER BY a.date DESC'
    
    cur.execute(query)
    rows = cur.fetchall()
    
    articles = []
    for row in rows:
        articles.append({
            'id': row[0],
            'title': row[1],
            'excerpt': row[2],
            'date': row[3].isoformat(),
            'category': row[4],
            'readTime': row[5],
            'author': row[6],
            'tags': row[7] if row[7] else []
        })
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps(articles),
        'isBase64Encoded': False
    }
