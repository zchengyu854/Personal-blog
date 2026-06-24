from app.database import engine
from sqlalchemy import text

def add_hero_en_columns():
    with engine.connect() as conn:
        try:
            conn.execute(text('ALTER TABLE hero ADD COLUMN IF NOT EXISTS title_en VARCHAR(255)'))
            conn.execute(text('ALTER TABLE hero ADD COLUMN IF NOT EXISTS subtitle_en VARCHAR(255)'))
            conn.execute(text('ALTER TABLE hero ADD COLUMN IF NOT EXISTS description_en TEXT'))
            conn.execute(text('ALTER TABLE hero ADD COLUMN IF NOT EXISTS badge_text_en VARCHAR(100)'))
            conn.commit()
            print('Successfully added English columns to hero table')
        except Exception as e:
            conn.rollback()
            print(f'Error adding columns: {e}')

if __name__ == '__main__':
    add_hero_en_columns()