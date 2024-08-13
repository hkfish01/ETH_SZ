import Base from "@/x/server/base"

class Blog extends Base {
  queryBlogList(params){
    return this.get('/nft-api/publish/blog-list/', { params }).then(this._handleResult)
  }
  queryBlogDetail(params){
    return this.get(`/nft-api/publish/blog-list/${params.id}/detail/`).then(this._handleResult)
  }
  queryBlogCommentList(params){
    return this.get('/nft-api/publish/blog-comment-list/', { params }).then(this._handleResult)
  }
  createBlogComment(params){
    return this.post('/nft-api/publish/create-blog-comment/', params).then(this._handleResult)
  }
}

export default new Blog()