from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.models.domain import Post, Route, PostLike

def calculate_feed_score(db: Session, user_id: str, skip: int = 0, limit: int = 20):
    cutoff_date = datetime.utcnow() - timedelta(days=15)
    recent_posts = db.query(Post).filter(Post.created_at >= cutoff_date).all()
    
    # Se não tiver posts recentes, puxa os normais aplicando a paginação do banco
    if not recent_posts:
        return db.query(Post).order_by(Post.created_at.desc()).offset(skip).limit(limit).all()

    liked_categories_query = (
        db.query(Route.category)
        .join(Post, Post.route_id == Route.id)
        .join(PostLike, PostLike.post_id == Post.id)
        .filter(PostLike.user_id == user_id)
        .distinct()
        .all()
    )
    recent_categories_liked = [item[0] for item in liked_categories_query if item[0]]

    scored_posts = []
    now = datetime.utcnow()

    for post in recent_posts:
        likes_count = len(post.likes) if post.likes else 0
        comments_count = len(post.comments) if post.comments else 0
        base_score = (likes_count * 1.0) + (comments_count * 2.0)
        if base_score == 0:
            base_score = 0.5 

        age_in_hours = (now - post.created_at).total_seconds() / 3600
        time_decay_factor = (age_in_hours + 2) ** 1.5
        decayed_score = base_score / time_decay_factor

        category_boost = 1.0
        if post.route_id:
            route = db.query(Route).filter(Route.id == post.route_id).first()
            if route and route.category in recent_categories_liked:
                category_boost = 1.5
        
        final_score = decayed_score * category_boost
        
        scored_posts.append({"post": post, "score": final_score})

    scored_posts.sort(key=lambda x: x["score"], reverse=True)
    
    top_posts = [item["post"] for item in scored_posts[skip : skip + limit]]
    
    return top_posts