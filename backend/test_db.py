from app.database import engine, SessionLocal
from sqlalchemy import text

try:
    with engine.connect() as conn:
        result = conn.execute(text('SELECT * FROM stats'))
        print('Stats:', [dict(row) for row in result])
    print('Database connection successful')
except Exception as e:
    print(f'Database connection failed: {e}')

db = SessionLocal()
try:
    from app.models.stat import Stat
    stats = db.query(Stat).all()
    print('ORM Stats:', [{'id': s.id, 'value': s.value, 'label': s.label} for s in stats])
except Exception as e:
    print(f'ORM query failed: {e}')
