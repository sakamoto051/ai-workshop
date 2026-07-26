import { db } from './database';

export interface Review {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  comment: string;
  createdAt: Date;
}

export class ProductReviewService {
  /**
   * 商品のレビュー一覧を取得する
   */
  async getReviewsByProductId(productId: number): Promise<Review[]> {
    // プレースホルダーを使用してSQLインジェクションを防止
    const sql = "SELECT id, product_id, user_id, rating, comment, created_at FROM product_reviews WHERE product_id = ?";
    
    const results = await db.query(sql, [productId]);
    
    return results.map((row: any) => ({
      id: row.id,
      productId: row.product_id,
      userId: row.user_id,
      rating: row.rating,
      comment: row.comment,
      createdAt: row.created_at,
    }));
  }

  /**
   * 商品レビューを投稿する
   */
  async postReview(productId: number, userId: number, rating: number, comment: string): Promise<void> {
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5.');
    }

    // プレースホルダーを使用してSQLインジェクションを防止
    const sql = "INSERT INTO product_reviews (product_id, user_id, rating, comment, created_at) VALUES (?, ?, ?, ?, NOW())";
    
    await db.query(sql, [productId, userId, rating, comment]);
  }
}
