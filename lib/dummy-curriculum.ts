import { CurriculumGraph } from "./types";

// Extended dummy curriculum graph with 15+ nodes for testing scalability
export const dummyCurriculumGraph: CurriculumGraph = {
  meta: {
    curriculum_id: "curr-attention-001",
    paper_id: "paper-attention-001",
    paper_title: "Attention Is All You Need",
    paper_authors: ["Vaswani et al."],
    created_at: "2024-01-15T10:30:00Z",
    total_study_time_hours: 24,
    total_nodes: 16,
  },
  first_node_order: [
    "node-linear-algebra",
    "node-seq2seq",
    "node-positional-encoding",
  ],
  nodes: [
    // Layer 1 - Foundations
    {
      keyword_id: "node-linear-algebra",
      keyword: "Linear Algebra",
      description:
        "행렬 연산, 벡터 공간, 고유값 분해 등 딥러닝의 수학적 기초입니다.",
      importance: 5,
      layer: 1,
      resources: [
        {
          resource_id: "res-la-1",
          name: "3Blue1Brown: Essence of Linear Algebra",
          url: "https://youtube.com/playlist",
          type: "video",
          description: "선형대수 핵심 개념을 시각적으로 설명",
          difficulty: 2,
          importance: 7,
          study_load_minutes: 60,
          is_core: true,
        },
        {
          resource_id: "res-la-2",
          name: "3Blue1Brown: Essence of Linear Algebra",
          url: "https://youtube.com/playlist",
          type: "video",
          description: "선형대수 핵심 개념을 시각적으로 설명",
          difficulty: 2,
          importance: 7,
          study_load_minutes: 60,
          is_core: true,
        },
      ],
    },
    {
      keyword_id: "node-neural-network",
      keyword: "Neural Networks",
      description:
        "인공 신경망의 기본 구조: 뉴런, 레이어, 활성화 함수, 역전파 알고리즘을 다룹니다.",
      importance: 6,
      layer: 1,
      resources: [
        {
          resource_id: "res-nn-1",
          name: "Deep Learning Book - Chapter 6",
          url: "https://deeplearningbook.org",
          type: "article",
          description: "Goodfellow의 딥러닝 교과서 신경망 챕터",
          difficulty: 4,
          importance: 8,
          study_load_minutes: 90,
          is_core: true,
        },
      ],
    },
    // Layer 2
    {
      keyword_id: "node-rnn",
      keyword: "RNN",
      description:
        "순환 신경망은 시퀀스 데이터를 처리하며, 이전 상태의 정보를 현재 계산에 활용합니다.",
      importance: 6,
      layer: 2,
      resources: [
        {
          resource_id: "res-rnn-1",
          name: "Understanding LSTM Networks",
          url: "https://colah.github.io/posts/2015-08-Understanding-LSTMs/",
          type: "article",
          description: "RNN과 LSTM의 핵심 개념을 시각적으로 설명",
          difficulty: 3,
          importance: 7,
          study_load_minutes: 30,
          is_core: true,
        },
        {
          resource_id: "res-rnn-2",
          name: "Understanding LSTM Networks",
          url: "https://colah.github.io/posts/2015-08-Understanding-LSTMs/",
          type: "article",
          description: "RNN과 LSTM의 핵심 개념을 시각적으로 설명",
          difficulty: 3,
          importance: 7,
          study_load_minutes: 30,
          is_core: true,
        },
      ],
    },
    {
      keyword_id: "node-word-embedding",
      keyword: "Word Embeddings",
      description:
        "단어를 밀집 벡터로 표현하는 기법. Word2Vec, GloVe 등이 대표적입니다.",
      importance: 5,
      layer: 2,
      resources: [
        {
          resource_id: "res-emb-1",
          name: "Word2Vec Paper",
          url: "https://arxiv.org/abs/1301.3781",
          type: "paper",
          description: "Mikolov et al.의 Word2Vec 원본 논문",
          difficulty: 5,
          importance: 6,
          study_load_minutes: 45,
          is_core: false,
        },
      ],
    },
    // Layer 3
    {
      keyword_id: "node-lstm",
      keyword: "LSTM",
      description:
        "Long Short-Term Memory는 RNN의 장기 의존성 문제를 해결한 구조입니다.",
      importance: 7,
      layer: 3,
      resources: [
        {
          resource_id: "res-lstm-1",
          name: "LSTM Original Paper",
          url: "https://www.bioinf.jku.at/publications/older/2604.pdf",
          type: "paper",
          description: "Hochreiter & Schmidhuber의 LSTM 논문",
          difficulty: 6,
          importance: 7,
          study_load_minutes: 60,
          is_core: true,
        },
      ],
    },
    {
      keyword_id: "node-seq2seq",
      keyword: "Seq2Seq",
      description:
        "Sequence-to-Sequence 모델은 입력 시퀀스를 출력 시퀀스로 변환합니다. 기계 번역의 기초입니다.",
      importance: 7,
      layer: 3,
      resources: [
        {
          resource_id: "res-seq2seq-1",
          name: "Sequence to Sequence Learning with Neural Networks",
          url: "https://arxiv.org/abs/1409.3215",
          type: "paper",
          description: "Google의 Seq2Seq 모델 원본 논문",
          difficulty: 6,
          importance: 8,
          study_load_minutes: 60,
          is_core: true,
        },
      ],
    },
    // Layer 4
    {
      keyword_id: "node-attention",
      keyword: "Attention Mechanism",
      description:
        "어텐션은 디코더가 소스 시퀀스의 관련 부분에 집중할 수 있게 합니다. RNN의 정보 병목을 해결합니다.",
      importance: 10,
      layer: 4,
      resources: [
        {
          resource_id: "res-attn-1",
          name: "Neural Machine Translation by Jointly Learning to Align and Translate",
          url: "https://arxiv.org/abs/1409.0473",
          type: "paper",
          description: "Bahdanau Attention 원본 논문",
          difficulty: 6,
          importance: 9,
          study_load_minutes: 45,
          is_core: true,
        },
        {
          resource_id: "res-attn-2",
          name: "Neural Machine Translation by Jointly Learning to Align and Translate",
          url: "https://arxiv.org/abs/1409.0473",
          type: "paper",
          description: "Bahdanau Attention 원본 논문",
          difficulty: 6,
          importance: 9,
          study_load_minutes: 45,
          is_core: true,
        },
      ],
    },
    {
      keyword_id: "node-encoder-decoder",
      keyword: "Encoder-Decoder",
      description:
        "입력을 압축하고(Encoder) 출력을 생성하는(Decoder) 아키텍처 패턴입니다.",
      importance: 7,
      layer: 4,
      resources: [
        {
          resource_id: "res-enc-1",
          name: "Learning Phrase Representations",
          url: "https://arxiv.org/abs/1406.1078",
          type: "paper",
          description: "Encoder-Decoder 구조 설명",
          difficulty: 5,
          importance: 7,
          study_load_minutes: 40,
          is_core: false,
        },
      ],
    },
    // Layer 5
    {
      keyword_id: "node-self-attention",
      keyword: "Self-Attention",
      description:
        "시퀀스 내 각 위치가 다른 모든 위치와 관계를 계산합니다. Transformer의 핵심입니다.",
      importance: 9,
      layer: 5,
      resources: [
        {
          resource_id: "res-self-1",
          name: "The Illustrated Transformer",
          url: "https://jalammar.github.io/illustrated-transformer/",
          type: "article",
          description: "Transformer를 시각적으로 설명하는 유명 블로그",
          difficulty: 3,
          importance: 9,
          study_load_minutes: 40,
          is_core: true,
        },
      ],
    },
    {
      keyword_id: "node-scaled-dot",
      keyword: "Scaled Dot-Product",
      description:
        "Query, Key, Value 연산으로 attention score를 계산합니다. √d_k로 스케일링합니다.",
      importance: 8,
      layer: 5,
      resources: [
        {
          resource_id: "res-scaled-1",
          name: "Attention Is All You Need",
          url: "https://arxiv.org/abs/1706.03762",
          type: "paper",
          description: "Transformer 원본 논문 Section 3.2",
          difficulty: 5,
          importance: 9,
          study_load_minutes: 30,
          is_core: true,
        },
      ],
    },
    // Layer 6
    {
      keyword_id: "node-multi-head",
      keyword: "Multi-Head Attention",
      description:
        "여러 attention head를 병렬로 사용하여 다양한 관점에서 정보를 통합합니다.",
      importance: 9,
      layer: 6,
      resources: [
        {
          resource_id: "res-mh-1",
          name: "Multi-Head Attention Explained",
          url: "https://example.com",
          type: "video",
          description: "Multi-Head Attention 동작 원리 시각화",
          difficulty: 4,
          importance: 8,
          study_load_minutes: 25,
          is_core: true,
        },
      ],
    },
    {
      keyword_id: "node-positional",
      keyword: "Positional Encoding",
      description:
        "Transformer에 위치 정보를 주입합니다. 사인/코사인 함수를 사용한 절대 위치 인코딩입니다.",
      importance: 8,
      layer: 6,
      resources: [
        {
          resource_id: "res-pos-1",
          name: "Positional Encoding Visualized",
          url: "https://kazemnejad.com/blog/transformer_architecture_positional_encoding/",
          type: "article",
          description: "Positional Encoding의 수학적 원리와 시각화",
          difficulty: 4,
          importance: 7,
          study_load_minutes: 25,
          is_core: false,
        },
      ],
    },
    // Layer 7
    {
      keyword_id: "node-ffn",
      keyword: "Feed-Forward Network",
      description:
        "Transformer 블록 내 2층 MLP. 각 위치에 독립적으로 적용됩니다.",
      importance: 6,
      layer: 7,
      resources: [
        {
          resource_id: "res-ffn-1",
          name: "FFN in Transformers",
          url: "https://example.com",
          type: "article",
          description: "Position-wise Feed-Forward 설명",
          difficulty: 3,
          importance: 6,
          study_load_minutes: 20,
          is_core: false,
        },
      ],
    },
    {
      keyword_id: "node-layer-norm",
      keyword: "Layer Normalization",
      description:
        "레이어 단위 정규화. Batch Normalization과 달리 시퀀스 길이에 독립적입니다.",
      importance: 5,
      layer: 7,
      resources: [
        {
          resource_id: "res-ln-1",
          name: "Layer Normalization Paper",
          url: "https://arxiv.org/abs/1607.06450",
          type: "paper",
          description: "Layer Normalization 원본 논문",
          difficulty: 4,
          importance: 5,
          study_load_minutes: 30,
          is_core: false,
        },
      ],
    },
    // Layer 8
    {
      keyword_id: "node-transformer",
      keyword: "Transformer",
      description:
        "Self-Attention을 기반으로 한 혁신적인 아키텍처. RNN 없이 시퀀스를 병렬 처리합니다.",
      importance: 10,
      layer: 8,
      resources: [
        {
          resource_id: "res-tr-1",
          name: "Attention Is All You Need",
          url: "https://arxiv.org/abs/1706.03762",
          type: "paper",
          description: "Transformer를 제안한 원본 논문",
          difficulty: 7,
          importance: 10,
          study_load_minutes: 90,
          is_core: true,
        },
        {
          resource_id: "res-tr-2",
          name: "Annotated Transformer",
          url: "https://nlp.seas.harvard.edu/annotated-transformer/",
          type: "code",
          description: "논문을 PyTorch 코드와 함께 설명",
          difficulty: 5,
          importance: 8,
          study_load_minutes: 60,
          is_core: true,
        },
      ],
    },
    // Layer 9
    {
      keyword_id: "node-bert",
      keyword: "BERT",
      description:
        "Bidirectional Encoder Representations. 양방향 컨텍스트를 활용한 사전학습 모델입니다.",
      importance: 8,
      layer: 9,
      resources: [
        {
          resource_id: "res-bert-1",
          name: "BERT Paper",
          url: "https://arxiv.org/abs/1810.04805",
          type: "paper",
          description: "BERT 원본 논문",
          difficulty: 6,
          importance: 8,
          study_load_minutes: 60,
          is_core: false,
        },
      ],
    },
  ],
  edges: [
    // Foundations
    {
      from_keyword_id: "node-linear-algebra",
      to_keyword_id: "node-neural-network",
      relationship: "prerequisite",
    },
    {
      from_keyword_id: "node-neural-network",
      to_keyword_id: "node-rnn",
      relationship: "prerequisite",
    },
    {
      from_keyword_id: "node-neural-network",
      to_keyword_id: "node-word-embedding",
      relationship: "prerequisite",
    },
    // RNN path
    {
      from_keyword_id: "node-rnn",
      to_keyword_id: "node-lstm",
      relationship: "prerequisite",
    },
    {
      from_keyword_id: "node-lstm",
      to_keyword_id: "node-seq2seq",
      relationship: "prerequisite",
    },
    {
      from_keyword_id: "node-word-embedding",
      to_keyword_id: "node-seq2seq",
      relationship: "prerequisite",
    },
    // Attention path
    {
      from_keyword_id: "node-seq2seq",
      to_keyword_id: "node-attention",
      relationship: "prerequisite",
    },
    {
      from_keyword_id: "node-seq2seq",
      to_keyword_id: "node-encoder-decoder",
      relationship: "prerequisite",
    },
    {
      from_keyword_id: "node-attention",
      to_keyword_id: "node-self-attention",
      relationship: "prerequisite",
    },
    {
      from_keyword_id: "node-encoder-decoder",
      to_keyword_id: "node-self-attention",
      relationship: "related",
    },
    // Self-Attention components
    {
      from_keyword_id: "node-self-attention",
      to_keyword_id: "node-scaled-dot",
      relationship: "prerequisite",
    },
    {
      from_keyword_id: "node-scaled-dot",
      to_keyword_id: "node-multi-head",
      relationship: "prerequisite",
    },
    {
      from_keyword_id: "node-self-attention",
      to_keyword_id: "node-positional",
      relationship: "related",
    },
    // Transformer components
    {
      from_keyword_id: "node-multi-head",
      to_keyword_id: "node-ffn",
      relationship: "prerequisite",
    },
    {
      from_keyword_id: "node-multi-head",
      to_keyword_id: "node-layer-norm",
      relationship: "prerequisite",
    },
    {
      from_keyword_id: "node-ffn",
      to_keyword_id: "node-transformer",
      relationship: "prerequisite",
    },
    {
      from_keyword_id: "node-layer-norm",
      to_keyword_id: "node-transformer",
      relationship: "prerequisite",
    },
    {
      from_keyword_id: "node-positional",
      to_keyword_id: "node-transformer",
      relationship: "prerequisite",
    },
    // Extensions
    {
      from_keyword_id: "node-transformer",
      to_keyword_id: "node-bert",
      relationship: "prerequisite",
    },
  ],
};
