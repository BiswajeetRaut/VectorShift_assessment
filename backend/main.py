# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
from collections import deque

app = FastAPI()

# CORS - allow your frontend to call this backend during development
# You can restrict allow_origins to ["http://localhost:3000"] if you prefer
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for dev use; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic models ---
class Edge(BaseModel):
    id: Optional[str] = None
    source: str
    target: str
    sourceHandle: Optional[str] = None
    targetHandle: Optional[str] = None
    data: Optional[Dict] = None

class Pipeline(BaseModel):
    nodes: List[Dict] = []
    edges: List[Edge] = []

# --- Health check ---
@app.get("/")
def read_root():
    return {"Ping": "Pong"}

# --- Helper: Kahn's algorithm to check DAG ---
def is_dag_from_edges(nodes_list: List[Dict], edges_list: List[Edge]) -> bool:
    # Build set of node ids (include any ids referenced by edges)
    node_ids = {n.get("id") for n in nodes_list if isinstance(n, dict) and "id" in n}
    for e in edges_list:
        node_ids.add(e.source)
        node_ids.add(e.target)

    # Build adjacency list and indegree map
    adj = {nid: [] for nid in node_ids}
    indegree = {nid: 0 for nid in node_ids}

    for e in edges_list:
        # ensure source/target are present
        if e.source not in adj:
            adj[e.source] = []
            indegree.setdefault(e.source, 0)
        adj[e.source].append(e.target)
        indegree[e.target] = indegree.get(e.target, 0) + 1
        indegree.setdefault(e.target, indegree.get(e.target, 0))

    # Kahn's algorithm
    q = deque([nid for nid, deg in indegree.items() if deg == 0])
    visited = 0
    while q:
        u = q.popleft()
        visited += 1
        for v in adj.get(u, []):
            indegree[v] -= 1
            if indegree[v] == 0:
                q.append(v)

    # If we've visited all nodes, no cycle exists
    return visited == len(indegree)

# --- Endpoint: parse pipeline ---
@app.post("/pipelines/parse")
async def parse_pipeline(pipeline: Pipeline):
    """
    Accepts JSON body with 'nodes' (list) and 'edges' (list).
    Returns: { num_nodes: int, num_edges: int, is_dag: bool }
    """
    print(pipeline)
    nodes = pipeline.nodes or []
    edges = pipeline.edges or []

    num_nodes = len(nodes)
    num_edges = len(edges)

    try:
        dag = is_dag_from_edges(nodes, edges)
    except Exception:
        dag = False

    return {"num_nodes": num_nodes, "num_edges": num_edges, "is_dag": dag}
