from typing import List, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
import json


async def knn_search_by_vector(session: AsyncSession, table: str, id_col: str, vector_col: str, query_vec: List[float], limit: int = 10) -> List[dict]:
    """Run a KNN search using Postgres pgvector operator `<->`.

    This helper executes raw SQL using the provided async session. It assumes
    the pgvector extension is enabled and the target table has a vector column
    named `vector_col`.

    Returns a list of dictionaries for the top-k rows with their distance.
    """
    # Ensure vector parameter is passed as PostgreSQL array literal
    # Use json.dumps to safely format and then cast on the SQL side to vector
    vec_json = json.dumps(query_vec)
    sql = text(f"SELECT {id_col}, *, {vector_col} <-> CAST(:v AS vector) AS distance FROM {table} ORDER BY distance ASC LIMIT :k")
    params = {"v": vec_json, "k": limit}
    result = await session.execute(sql, params)
    rows = result.mappings().all()
    out = []
    for r in rows:
        # convert RowMapping to dict; distance may be Decimal/float
        d = dict(r)
        out.append(d)
    return out
