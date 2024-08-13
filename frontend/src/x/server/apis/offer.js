import Base from "@/x/server/base"
class Offer extends Base {
  createOffer(params){
    return this.post('/nft-api/nft/offer/', params).then(this._handleResult);
  }
  acceptOffer(params){
    return this.put(`/nft-api/nft/offer/${params.id}/accept/`).then(this._handleResult);
  }
  cancelOffer(params){
    return this.put(`/nft-api/nft/offer/${params.id}/cancel/`).then(this._handleResult);
  }
  offerPayConfirm(params){
    return this.post('/nft-api/nft/offer/pay-confirm/', params).then(this._handleResult);
  }
  rejectOffer(params){
    return this.put(`/nft-api/nft/offer/${params.id}/reject/`).then(this._handleResult);
  }
  myOfferList(params){
    return this.get(`/nft-api/nft/offer/my-list/`, { params }).then(this._handleResult);
  }
  offerHistoryList(params){
    return this.get(`/nft-api/nft/offer/nft-list/`, { params }).then(this._handleResult);
  }
  myCreateOfferList(params){
    return this.get(`/nft-api/nft/offer/my-created-list/`, { params }).then(this._handleResult);
  }
}

export default new Offer()
