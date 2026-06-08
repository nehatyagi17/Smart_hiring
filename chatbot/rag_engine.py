from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

_model = None
_chunks = None
_embeddings = None


def get_model():
    global _model
    if _model is None:
        _model = SentenceTransformer("all-MiniLM-L6-v2")
    return _model


def load_chunks():
    global _chunks
    if _chunks is None:
        _chunks = [
            "Leave Policy:\nEmployees are entitled to 20 paid leaves per year excluding public holidays.",
            "Working Hours:\nStandard working hours are from 9 AM to 6 PM, Monday to Friday.",
            "Work From Home Policy:\nEmployees can work from home up to 2 days per week with manager approval.",
            "Holidays:\nThe company observes national holidays and publishes an annual holiday calendar.",
            "Leave Application:\nEmployees should apply for leave via the HR portal or inform their manager."
        ]
    return _chunks


def load_embeddings():
    global _embeddings
    if _embeddings is None:
        model = get_model()
        chunks = load_chunks()
        _embeddings = model.encode(chunks)
    return _embeddings


def get_rag_answer(question):
    model = get_model()
    chunks = load_chunks()
    embeddings = load_embeddings()

    q_embedding = model.encode([question])
    scores = cosine_similarity(q_embedding, embeddings)[0]

    best_idx = scores.argmax()

    if scores[best_idx] < 0.3:
        return "Sorry, I couldn't find a relevant answer."

    return chunks[best_idx]
