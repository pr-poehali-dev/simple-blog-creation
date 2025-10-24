import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Получение одной статьи по ID с тегами и комментариями
    Args: event с httpMethod (GET), queryStringParameters (id)
    Returns: HTTP response с JSON объектом статьи
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
    
    params = event.get('queryStringParameters') or {}
    article_id = params.get('id')
    
    if not article_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Article ID is required'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    
    cur.execute('''
        SELECT a.id, a.title, a.excerpt, a.content, a.date, a.category, a.read_time, a.author,
               ARRAY_AGG(DISTINCT t.name) as tags
        FROM articles a
        LEFT JOIN article_tags at ON a.id = at.article_id
        LEFT JOIN tags t ON at.tag_id = t.id
        WHERE a.id = %s
        GROUP BY a.id, a.title, a.excerpt, a.content, a.date, a.category, a.read_time, a.author
    ''', (article_id,))
    
    row = cur.fetchone()
    
    if not row:
        cur.close()
        conn.close()
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Article not found'}),
            'isBase64Encoded': False
        }
    
    cur.execute('''
        SELECT id, author, text, date
        FROM comments
        WHERE article_id = %s
        ORDER BY date ASC
    ''', (article_id,))
    
    comments_rows = cur.fetchall()
    comments = []
    for comment_row in comments_rows:
        comments.append({
            'id': comment_row[0],
            'author': comment_row[1],
            'text': comment_row[2],
            'date': comment_row[3].isoformat()
        })
    
    content_paragraphs = row[3].split('\n\n')
    
    article = {
        'id': row[0],
        'title': row[1],
        'excerpt': row[2],
        'content': content_paragraphs,
        'date': row[4].isoformat(),
        'category': row[5],
        'readTime': row[6],
        'author': row[7],
        'tags': row[8] if row[8] else [],
        'comments': comments
    }
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps(article),
        'isBase64Encoded': False
    }
