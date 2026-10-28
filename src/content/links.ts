// TODO: Verify configured contact details and fill empty destinations before publishing.
export type PortfolioLinks = {
  email: string
  github: string
  instagram: string
  whatsapp: string
  linkedin: string
  cv: string
}

export const links: PortfolioLinks = {
  email: 'isnainil.fadhili@gmail.com',
  github: 'https://github.com/afadhili',
  instagram: 'https://www.instagram.com/ai.fdhl',
  whatsapp: 'https://wa.me/+6289607054537',
  linkedin: '', // TODO: Your LinkedIn profile URL.
  cv: '', // TODO: Put your CV in public/ and set its path (for example /cv.pdf).
}

type Link = {
  name: string
  link: string
  logo: string
}
export type PortfolioLinksV2 = Link[]

export const portfolioLinksV2: PortfolioLinksV2 = [
  {
    name: 'GitHub',
    link: 'https://github.com/afadhili',
    logo: 'github.svg',
  },
  {
    name: 'Instagram',
    link: 'https://www.instagram.com/ai.fdhl',
    logo: 'social-icons/instagram.svg',
  },
  {
    name: 'WhatsApp',
    link: 'https://wa.me/+6289607054537',
    logo: 'social-icons/whatsapp.svg',
  },
]
