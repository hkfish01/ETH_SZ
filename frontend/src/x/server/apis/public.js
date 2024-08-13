import Base from "@/x/server/base"
class Public extends Base {
  subscribeNewsletter(params) {
    return this.post("/nft-api/newsletter/", params).then(this._handleResult);
  }

  queryETHPrice() {
    return this.get("/nft-api/scheduler/get-eth-price/").then(this._handleResult);
  }

  queryAsk(params) {
    return this.post("/nft-api/ask", params).then(this._handleResult);
  }
}

export default new Public();