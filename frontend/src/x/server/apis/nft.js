import Base from "@/x/server/base"
import qs from "qs"
class Home extends Base {
  queryNftList() {
    return this.get(`/prod-api/nft/nftProduct/list`, { pageNum: 1, pageSize: 100 }).then(this._handleResult)
  }
  queryNftDetail(id) {
    return this.get(`/prod-api/nft/nftProduct/${id}`).then(this._handleResult)
  }
  createNftDetail(data) {
    return this.post(`/prod-api/nft/nftProduct`, data).then(this._handleResult)
  }

  createCollection(data) {
    return this.post(`/prod-api/nft/collection`, data).then(this._handleResult)
  }


  create(params) {
    return this.post("/nft-api/nft/create-nft/", params, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });
  }

  createAuction(params) {
    return this.post("/nft-api/nft/auction/create-auction/", params, {
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
    });
  }

  uploadImage(params) {
    return this.post("/nft-api/nft/upload-nft-image/", params, {
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
    });
  }

  // queryNftList(params) {
  //   return this.get("/nft/nft-list/", {params});
  // }

  queryNftFilterList(params) {
    return this.get("/nft-api/nft/nft-filter-list/", {
      params,
      paramsSerializer: function (params) {
        return qs.stringify(params, {arrayFormat: "repeat"});
      },
    });
  }

  queryNftBillList(params) {
    return this.get("/nft-api/nft/bill-list/", {params});
  }
  
  queryNftDetails(params) {
    return this.get(`/nft-api/nft/nft-list/${params.id}/detail/`);
  }

  buyNftByPaypal(params) {
    return this.post("/nft-api/nft/buy-nft-by-paypal/", params);
  }

  bidNftByPaypal(params) {
    return this.post("/nft-api/nft/auction/bid-by-paypal/", params);
  }

  buyNftByStripe(params) {
    return this.post("/nft-api/nft/buy-nft-by-stripe/", params);
  }

  confirmToBuyByStripe(params) {
    return this.post("/nft-api/nft/confrim-to-by-stripe/", params);
  }

  buyNftByBalance(params) {
    return this.post("/nft-api/nft/buy-nft-by-balance/", params);
  }

  confirmToBuyByPaypal(params) {
    return this.post("/nft-api/nft/confirm-to-buy-by-paypal/", params);
  }

  confirmBidByPaypal(params) {
    return this.post("/nft-api/nft/auction/confirm-bid-by-paypal/", params);
  }

  queryCollectionList(params) {
    return this.get("/nft-api/nft/collection-list/", {params});
  }

  queryCollectionListFilter(params) {
    return this.get("/nft-api/nft/collection-filter-list/", {
      params,
      paramsSerializer: function (params) {
        return qs.stringify(params, {arrayFormat: "repeat"});
      },
    }).then(this._handleResult);
  }

  createCollection2(params) {
    return this.post("/nft-api/nft/create-collection/", params);
  }

  updatePrice(id, params) {
    return this.put(`/nft-api/nft/nft-list/${id}/update-price/`, params);
  }

  updateAuctionInfo(id, params) {
    return this.put(`/nft-api/nft/auction/nft-list/${id}/update-auction-info/`, params);
  }

  updateNft(id, params) {
    return this.patch(`/nft-api/nft/nft-list/${id}/update/`, params);
  }

  queryPaymentMethodList(params) {
    return this.get("/nft-api/nft/payment-method-list/", params);
  }

  withdrawAmount(params) {
    return this.post("/nft-api/nft/withdraw-amount/", params);
  }

  queryWithdrawRequestList() {
    return this.get("/nft-api/nft/withdraw-request-list/");
  }

  queryPopularNftList(params) {
    return this.get("/nft-api/nft/popular-nft-list/", {params});
  }

  queryActivityList(params) {
    return this.get("/nft-api/nft/activity-list/", {params});
  }

  cancelWithdraw(params) {
    return this.put(`/nft-api/nft/withdraw-request-list/${params.id}/cancel/`);
  }

  buyNftByMetaMask(params) {
    return this.post(`/nft-api/nft/buy-nft-by-metamask/`, params);
  }

  queryMetamaskPaymentStatus(params) {
    return this.get(`/nft-api/nft/get-metamask-payment-status/`, {params});
  }

  updateWithdrawingStatus(params) {
    return this.put(`/nft-api/nft/nft-list/${params.id}/update-withdrawing-status/`);
  }

  queryNftHistoryList(params) {
    return this.get("/nft-api/nft/nft-history-list/", {params}).then(this._handleResult);
  }

  // collections
  uploadCollectionBanner(params) {
    return this.post("/nft-api/nft/upload-collection-banner/", params, {
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
    });
  }

  uploadCollectionLogo(params) {
    return this.post("/nft-api/nft/upload-collection-logo/", params, {
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
    });
  }

  uploadCollectionImage(params) {
    return this.post("/nft-api/nft/upload-collection-image/", params, {
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
    });
  }

  // 修改Collection
  updateCollection(params) {
    return this.put(`/nft-api/nft/collection-list/${params.id}/update/`, params);
  }

  deleteCollection(params) {
    return this.delete(`/nft-api/nft/collection-list/${params.id}/delete/`);
  }

  queryCollectionDetail(params) {
    return this.get(`/nft-api/nft/collection-list/${params.id}/detail/`);
  }

  queryListing(params) {
    return this.get(`/nft-api/nft/listing-list/`, {params}).then(this._handleResult);
  }

  sendEmail(params) {
    return this.post(`/nft-api/nft/send-email/`, params);
  }

  queryAuctionUserList(params) {
    return this.get(`/nft-api/nft/auction/auction-user-list/`, {params});
  }

  queryNftRankingList(params) {
    return this.get(`/nft-api/nft/ranking-list/`, {params});
  }

  transferNft(params) {
    return this.post(`/nft-api/nft/transfer/`, params);
  }

  queryCategory() {
    return this.get(`/nft-api/nft/collection/category/`);
  }

  updateBottleWithdraw(params) {
    return this.get(`/nft-api/nft/nft-list/${params.id}/bottle-withdraw/`);
  }

  confirmPublish(params) {
    return this.get(`/nft-api/nft/nft-list/${params.id}/confirm-publish/`);
  }

  confirmTransaction(params) {
    return this.get(`/nft-api/nft/nft-list/${params.id}/confirm-transaction/`);
  }

  updateBrocumentKey(params) {
    return this.put(`/nft-api/nft/nft-list/${params.id}/update-brocument-key/`, params);
  }

  queryActivityFilterList(params) {
    return this.get("/nft-api/nft/activity-filter-list/", {params}).then(this._handleResult);
  }

  queryHoldList(params) {
    return this.get("/nft-api/nft/on-transaction-hold-list/", {params});
  }

  createFractional(params) {
    return this.post("/nft-api/nft/create-fractional/", params, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });
  }

  queryCurrentVoteCollection(id) {
    return this.get(`/nft-api/nft/vote/collection/${id}/`, {
      headers: {
        autoShowError: false
      }
    });
  }

  createVote(params) {
    return this.post(`/nft-api/nft/vote/create/`, params);
  }

  voting(params) {
    return this.post(`/nft-api/nft/vote/voting/`, params);
  }

  queryVoteHistory(id) {
    return this.get(`/nft-api/nft/vote/${id}/historys/`)
  }

  queryVoteCount(id) {
    return this.get(`/nft-api/nft/collection/${id}/count/`)
  }

  queryVoted(id) {
    return this.get(`/nft-api/nft/vote/${id}/voted/`)
  }

  queryFractionalCollectionList() {
    return this.get(`/nft-api/nft/piece/collection-list/`)
  }
}
export default new Home();