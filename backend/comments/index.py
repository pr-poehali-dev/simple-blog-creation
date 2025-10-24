import json
import os
import psycopg2
from typing import Dict, Any
from datetime import date

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Добавление комментариев к статьям
    Args: event с httpMethod (POST), body с article_id, author, text
    Returns: HTTP response с созданным комментарием
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    article_id = body_data.get('article_id')
    author = body_data.get('author')
    text = body_data.get('text')
    
    if not article_id or not author or not text:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'article_id, author and text are required'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    
    cur.execute('''
        INSERT INTO comments (article_id, author, text, date)
        VALUES (%s, %s, %s, %s)
        RETURNING id, author, text, date
    ''', (article_id, author, text, date.today()))
    
    row = cur.fetchone()
    conn.commit()
    
    comment = {
        'id': row[0],
        'author': row[1],
        'text': row[2],
        'date': row[3].isoformat()
    }
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 201,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps(comment),
        'isBase64Encoded': False
    }
