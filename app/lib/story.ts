export interface StorySegment {
  id: string;
  text: string[]; // Array of paragraphs
  alignment: 'left' | 'center' | 'right';
}

export const storyData: StorySegment[] = [
  {
    id: 'intro',
    text: [
      "...mungkin hanya aku?"
    ],
    alignment: 'center',
  },
  {
    id: 'meeting',
    text: [
      "Dulu, aku dan kamu bertemu di persimpangan yang tak pernah menjanjikan arah. Kata orang, tempat itu terlalu gelap untuk sesuatu tumbuh, tapi di sanalah aku melihat sesuatu dalam dirimu.",
      "Kita saling tatap, tak dengan dekat, tapi cukup untuk saling tahu bahwa ada sesuatu di antara dua jiwa yang diam-diam berharap, mungkin hanya aku?."
    ],
    alignment: 'left',
  },
  {
    id: 'realization',
    text: [
      "Aku tidak tau caramu diam, pada caramu tetap kuat. Tapi aku tahu, aku dan kamu hanya bisa sejauh ini.",
      "Tak pernah sejajar, tak pernah menyatu atau bahkan saling bertabrakan."
    ],
    alignment: 'right',
  },
  {
    id: 'regret',
    text: [
      "Suaramu masih terdengar di kepalaku, bahkan saat kamu tak mengucap apa pun. Aku tahu kamu berjuang, aku tahu kamu menahan banyak luka, dan aku... tidak ada di sana.",
      "Bukan karena tak peduli, tapi karena aku kalah oleh jarak dan takut.",
      "Maaf, aku tidak datang."
    ],
    alignment: 'left',
  },
  {
    id: 'candala',
    text: [
      "Andai candala ini bisa kugenggam dan kupatahkan, aku akan melakukannya untukmu.",
      "Tapi semua ini sudah menjadi batas yang tak bisa kutembus."
    ],
    alignment: 'center',
  },
  {
    id: 'resignation',
    text: [
      "Aku ingin jadi tempatmu pulang, tapi tak punya rumah untukmu singgah. Dan aku tertinggal di belakang dengan merangkak perlahan.",
      "Tak apa. Yang penting kamu tetap berjalan."
    ],
    alignment: 'right',
  },
  {
    id: 'acceptance',
    text: [
      "Hari ini pun rasanya masih sama, hanya kini ada hampa yang lebih nyata.",
      "Aku tetap aku, kamu tetap kamu, tapi kita tidak lagi bisa menyebut diri sebagai ‘kita’.",
      "Maaf, dan terima kasih karena pernah ada."
    ],
    alignment: 'left',
  },
  {
    id: 'promise',
    text: [
      "Karena selama kamu tetap ada di dunia ini, aku akan selalu jadi laki-laki yang sama—yang mengarahkan seluruh harapan baikku padamu dalam diam."
    ],
    alignment: 'center',
  },
  {
    id: 'farewell',
    text: [
      "Saat kamu akhirnya menggenggam harapanmu, atau menemukan seseorang yang ingin kamu temani sepanjang waktu, aku akan jadi orang pertama yang merayakannya.",
      "Kamu layak bahagia, kamu layak sampai pada tempat yang kamu impikan."
    ],
    alignment: 'right',
  },
  {
    id: 'closing',
    text: [
      "Terima kasih karena sudah pernah ada.",
      "Beberapa hal memang ditakdirkan untuk tumbuh dari kejauhan."
    ],
    alignment: 'center',
  }
];
