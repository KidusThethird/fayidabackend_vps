// generateSignedToken(amount, paymentreason){
//     const time = Math.floor(Date.now() / 1000);

//     const payload = {
//         amount, paymentReason,
//         merchantId: this.merchantId,
//         generated: time
//     }

//     return JsonWebTokenError.sign(JSON.stringify(payload), this.privateKey, {algorithm: 'ES256'})
// }