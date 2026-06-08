from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from .policy_sections import HR_POLICY

_model = None
_embeddings = None
_sections = None


def load_model():
    global _model
    if _model is None:
        _model = SentenceTransformer("all-MiniLM-L6-v2")
    return _model


def load_policy():
    global _sections
    if _sections is None:
        _sections = list(HR_POLICY.values())
    return _sections


def load_embeddings():
    global _embeddings
    if _embeddings is None:
        model = load_model()
        sections = load_policy()
        _embeddings = model.encode(sections)
    return _embeddings


def get_advanced_answer(question, context=None):
    model = load_model()
    sections = load_policy()
    embeddings = load_embeddings()

    combined_query = question
    if context:
        combined_query = context + " " + question

    query_embedding = model.encode([combined_query])
    scores = cosine_similarity(query_embedding, embeddings)[0]

    best_index = scores.argmax()
    confidence = scores[best_index]

    if confidence < 0.35:
        return {
            "answer": "I’m not fully sure. Please contact HR for accurate information.",
            "confidence": round(float(confidence), 2)
        }

    return {
        "answer": sections[best_index].strip(),
        "confidence": round(float(confidence), 2)
    }
