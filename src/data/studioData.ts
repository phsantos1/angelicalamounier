import heroPortrait from '../assets/images/hero_natural_beauty_1795031304473.jpg';
import serviceMakeup from '../assets/images/service_makeup_1795031305109.jpg';
import serviceBrows from '../assets/images/service_brows_1795031305967.jpg';
import serviceNails from '../assets/images/service_nails_1795031305745.jpg';
import portfolioMakeup from '../assets/images/portfolio_makeup_editorial_1795031307632.jpg';
import portfolioBrows from '../assets/images/portfolio_brows_editorial_1795031307983.jpg';
import portfolioNails from '../assets/images/portfolio_nails_editorial_1795031307724.jpg';
import essenceDetail from '../assets/images/essence_atelier_detail_1795031308482.jpg';
import type { ServiceId } from '../utils/booking';

export const HERO_MEDIA = {
  src: heroPortrait,
  alt: 'Retrato editorial de beleza natural com pele iluminada, sobrancelhas penteadas ao natural e luz suave da manhã',
};

export const ESSENCE_MEDIA = {
  src: essenceDetail,
  alt: 'Pincéis de cerdas naturais e cerâmica sobre linho bege e pedra travertino sob luz suave',
};

export interface ServiceItem {
  id: ServiceId;
  index: string;
  name: string;
  kicker: string;
  description: string;
  focusNote: string;
  image: string;
  imageAlt: string;
  ctaLabel: string;
}

export const SERVICES: ServiceItem[] = [
  {
    id: 'maquiagem',
    index: '01',
    name: 'Maquiagem',
    kicker: 'Pele viva & acabamento sutil',
    description:
      'Produção pensada para realçar seus traços e respeitar a textura da sua pele, com acabamento natural para diferentes ocasiões.',
    focusNote: 'Leveza no toque, harmonia nos tons e fidelidade à sua expressão.',
    image: serviceMakeup,
    imageAlt:
      'Referência visual de maquiagem natural com pele luminosa, rubor rosado discreto e pincel sobre travertino',
    ctaLabel: 'Escolher Maquiagem',
  },
  {
    id: 'sobrancelhas',
    index: '02',
    name: 'Sobrancelhas',
    kicker: 'Moldura & equilíbrio do olhar',
    description:
      'Cuidado voltado para o desenho harmônico e a valorização do formato natural, respeitando a expressão do seu rosto.',
    focusNote: 'Respeito ao crescimento dos fios e suavidade na leitura do olhar.',
    image: serviceBrows,
    imageAlt:
      'Referência visual de sobrancelhas naturais bem alinhadas em luz de janela suave',
    ctaLabel: 'Escolher Sobrancelhas',
  },
  {
    id: 'unhas',
    index: '03',
    name: 'Unhas',
    kicker: 'Delicadeza & mãos cuidadas',
    description:
      'Cuidado dedicado ao acabamento limpo, delicado e bem-feito, valorizando a leveza e a naturalidade das mãos.',
    focusNote: 'Estética discreta, contornos limpos e tons suaves que combinam com você.',
    image: serviceNails,
    imageAlt:
      'Referência visual de mãos cuidadas com unhas naturais em tom nude rosado translúcido sobre linho bege',
    ctaLabel: 'Escolher Unhas',
  },
];

export type PortfolioCategory = 'todos' | ServiceId;

export interface PortfolioItem {
  id: string;
  category: ServiceId;
  categoryLabel: string;
  title: string;
  caption: string;
  image: string;
  imageAlt: string;
  aspectClass: string;
  isIllustrative: true;
}

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 'ref-makeup-01',
    category: 'maquiagem',
    categoryLabel: 'Maquiagem',
    title: 'Luminosidade e textura real de pele',
    caption: 'Imagem conceitual ilustrativa — referência estética em tons areia e nude suave.',
    image: portfolioMakeup,
    imageAlt:
      'Imagem ilustrativa de perfil feminino com pele iluminada natural e suéter creme em estúdio claro',
    aspectClass: 'aspect-[3/4]',
    isIllustrative: true,
  },
  {
    id: 'ref-brows-01',
    category: 'sobrancelhas',
    categoryLabel: 'Sobrancelhas',
    title: 'Fios naturais em destaque suave',
    caption: 'Imagem conceitual ilustrativa — referência de leveza e respeito ao desenho próprio.',
    image: portfolioBrows,
    imageAlt:
      'Imagem ilustrativa destacando sobrancelhas naturais penteadas e pele fresca em luz natural',
    aspectClass: 'aspect-[4/3]',
    isIllustrative: true,
  },
  {
    id: 'ref-nails-01',
    category: 'unhas',
    categoryLabel: 'Unhas',
    title: 'Acabamento limpo em nude areia',
    caption: 'Imagem conceitual ilustrativa — referência de mãos naturais em paleta bege quente.',
    image: portfolioNails,
    imageAlt:
      'Imagem ilustrativa de mãos com esmaltação nude segurando xícara de cerâmica artesanal sobre linho',
    aspectClass: 'aspect-[3/4]',
    isIllustrative: true,
  },
  {
    id: 'ref-makeup-02',
    category: 'maquiagem',
    categoryLabel: 'Maquiagem',
    title: 'Rubor discreto e luz diurna',
    caption: 'Imagem conceitual ilustrativa — referência de equilíbrio entre rosado sutil e pele fresca.',
    image: serviceMakeup,
    imageAlt:
      'Imagem ilustrativa de maquiagem com rubor rosado discreto e acabamento natural',
    aspectClass: 'aspect-[4/3]',
    isIllustrative: true,
  },
  {
    id: 'ref-brows-02',
    category: 'sobrancelhas',
    categoryLabel: 'Sobrancelhas',
    title: 'Moldura orgânica para o olhar',
    caption: 'Imagem conceitual ilustrativa — referência de harmonia facial sem excessos.',
    image: serviceBrows,
    imageAlt:
      'Imagem ilustrativa de olhar natural com sobrancelhas alinhadas e pele suave',
    aspectClass: 'aspect-[4/3]',
    isIllustrative: true,
  },
  {
    id: 'ref-nails-02',
    category: 'unhas',
    categoryLabel: 'Unhas',
    title: 'Transparência rosada sobre linho',
    caption: 'Imagem conceitual ilustrativa — referência de cuidado delicado nas mãos.',
    image: serviceNails,
    imageAlt:
      'Imagem ilustrativa de unhas curtas naturais em tom rosado suave sobre linho e pedra',
    aspectClass: 'aspect-[4/3]',
    isIllustrative: true,
  },
];

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-solicitacao',
    question: 'Como funciona a solicitação de atendimento pelo site?',
    answer:
      'Você escolhe o cuidado desejado, informa sua preferência de data e horário e preenche seu nome. O formulário organiza esses detalhes em uma mensagem pronta para envio direto à profissional, sem criar reserva automática.',
  },
  {
    id: 'faq-horarios',
    question: 'Escolher uma data e horário garante que o horário está reservado?',
    answer:
      'Não. Os campos de data e horário indicam apenas a sua preferência inicial. A disponibilidade real e a confirmação do atendimento acontecem diretamente na conversa pelo WhatsApp.',
  },
  {
    id: 'faq-whatsapp',
    question: 'O envio acontece automaticamente pelo site ao finalizar o formulário?',
    answer:
      'Não. Ao clicar em “Solicitar pelo WhatsApp”, a conversa com o número confirmado (37 9819-2692) é aberta com a mensagem pronta para você revisar e enviar manualmente. Você também pode falar pelo Instagram oficial @angelicalamounier_beauty.',
  },
  {
    id: 'faq-servicos',
    question: 'Posso solicitar orientação sobre qual cuidado combina melhor com o meu momento?',
    answer:
      'Sim. Caso esteja em dúvida entre maquiagem, sobrancelhas ou unhas — ou queira conversar sobre combinações e detalhes antes de confirmar — utilize o campo de observação opcional para mencionar seu interesse ou fale diretamente pelo Instagram @angelicalamounier_beauty.',
  },
];

export const STYLE_GUIDE_TOKENS = {
  colors: [
    { name: 'Café Expresso Profundo', hex: '#241712', role: 'Abertura, essência e contraste editorial' },
    { name: 'Café Torrado', hex: '#1A100C', role: 'Blocos escuros de respiro' },
    { name: 'Creme Suave (Canvas)', hex: '#FAF6F1', role: 'Seções claras e superfícies de leitura' },
    { name: 'Areia Quente', hex: '#EFE6DA', role: 'Fundo estrutural da galeria' },
    { name: 'Rosado Discreto', hex: '#C89A8E', role: 'Ação primária e destaques' },
    { name: 'Rosado Claro', hex: '#D9AEA2', role: 'Tipografia de destaque sobre café' },
    { name: 'Rosado Terroso', hex: '#8E5B4F', role: 'Ênfase tipográfica sobre claro (AA)' },
    { name: 'Taupe Profundo', hex: '#5E4A40', role: 'Textos secundários sobre claro (AA+)' },
  ],
  typography: [
    {
      role: 'Títulos & Assinatura Editorial',
      family: 'Cormorant Garamond',
      details: 'Pesos 400 e 500, itálico expressivo em palavras-chave, composição empilhada e respirada.',
    },
    {
      role: 'Corpo, Formulários & Interface',
      family: 'Plus Jakarta Sans',
      details: 'Pesos 400, 500 e 600, entrelinha generosa (1.6) e legibilidade contínua.',
    },
  ],
  principles: [
    'Alternância rítmica entre faixas café expresso e creme areia com transições suaves na fotografia.',
    'Paleta fiel à identidade natural: café, nude, bege quente, areia, rosado discreto e branco suave.',
    'Transparência absoluta: imagens ilustrativas identificadas e contato fiel ao confirmado.',
  ],
};
