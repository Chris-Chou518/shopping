const axios = require('axios')
const Base64 = require('crypto-js/enc-base64')
const { HmacSHA256 } = require('crypto-js')
const {
  LINEPAY_CHANNEL_ID,
  LINEPAY_CHANNEL_SECRET_KEY,
  LINEPAY_VERSION, LINEPAY_SITE,
  LINEPAY_RETURN_HOST,
  LINEPAY_RETURN_CONFIRM_URL,
  LINEPAY_RETURN_CANCEL_URL
} = process.env
const orders = {}

const linePayController = {
  getCheckout: (req, res) => {
    const { finalTotalPrice } = req.query
    const order = {
      amount: finalTotalPrice,
      currency: 'TWD',
      orderId: parseInt(new Date().getTime() / 1000),
      packages: [
        {
          id: 'product_1',
          amount: finalTotalPrice,
          products: [
            {
              name: 'Your_Order',
              quantity: 1,
              price: finalTotalPrice
            }
          ]
        }
      ]
    }
    orders[order.orderId] = order
    res.render('linePay/checkout', { finalTotalPrice, order })
  },
  createOrder: async (req, res) => {
    try {
      const { orderId } = req.params
      const order = orders[orderId]
      const linePayBody = {
        ...order,
        redirectUrls: {
          confirmUrl: `${LINEPAY_RETURN_HOST}${LINEPAY_RETURN_CONFIRM_URL}`,
          cancelUrl: `${LINEPAY_RETURN_HOST}${LINEPAY_RETURN_CANCEL_URL}`
        }
      }
      const uri = '/payments/request'
      const headers = createSignature(uri, linePayBody)
      const url = `${LINEPAY_SITE}/${LINEPAY_VERSION}${uri}`
      const linePayRes = await axios.post(url, linePayBody, { headers })
      console.log('發出linepay請求', linePayRes)
      // console.log(linePayRes.data.info)
      if (linePayRes?.data?.returnCode === '0000') {
        res.redirect(linePayRes?.data?.info.paymentUrl.web)
      }
      res.end()
    } catch (error) {
      console.log(error)
      res.end()
    }
  },
  confirmOrder: async (req, res) => {
    const { transactionId, orderId } = req.query
    try {
      const order = orders[orderId]
      const linePayBody = {
        amount: order.amount,
        currency: 'TWD'
      }
      const uri = `/payments/${transactionId}/confirm`
      const headers = createSignature(uri, linePayBody)
      const url = `${LINEPAY_SITE}/${LINEPAY_VERSION}${uri}`
      const linePayRes = await axios.post(url, linePayBody, { headers })
      console.log('付款成功', linePayRes)
      res.redirect('/success')
    } catch (error) {
      res.end()
    }
  },
  getSuccessPay: (req, res) => {
    res.render('linePay/success')
  }
}

function createSignature (uri, linePayBody) {
  const nonce = parseInt(new Date().getTime() / 1000)
  const string = `${LINEPAY_CHANNEL_SECRET_KEY}/${LINEPAY_VERSION}${uri}${JSON.stringify(linePayBody)}${nonce}`
  const signature = Base64.stringify(HmacSHA256(string, LINEPAY_CHANNEL_SECRET_KEY))

  const headers = {
    'X-LINE-ChannelId': LINEPAY_CHANNEL_ID,
    'Content-Type': 'application/json',
    'X-LINE-Authorization-Nonce': nonce,
    'X-LINE-Authorization': signature
  }
  return headers
}
module.exports = linePayController
