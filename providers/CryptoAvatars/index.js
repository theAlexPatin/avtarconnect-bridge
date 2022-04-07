import icon from './icon.png'

const CRYPTO_AVATARS_API = 'https://api.cryptoavatars.io'

export default {
  config: {
    apiKey: { required: true, type: String },
  },
  description: '3D avatars as NFTs for use across multiple virtual worlds',
  icon,
  id: 'crypto-avatars',
  pipeline: [
    {
      format(result) {
        const [address] = result
        return address
      },
      method: 'eth_requestAccounts',
      type: 'web3',
    },
    {
      async transform() {
        const { data } = await this.$axios.get(
          `${CRYPTO_AVATARS_API}/nfts/avatars/${this.aggregate}?skip=0&limit=20`,
          {
            headers: {
              'API-KEY': this.config.apiKey,
              accept: 'application/json',
            },
          }
        )
        return { result: data }
      },
      type: 'transform',
    },
    {
      getImage: ({ metadata: { image } }) => image,
      getName: ({ metadata: { name } }) => name,
      type: 'select',
    },
  ],
  title: 'Crypto Avatars',
}
