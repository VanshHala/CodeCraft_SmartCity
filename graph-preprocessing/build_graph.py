import argparse, json
import osmnx as ox
import networkx as nx

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--place", required=True, help='e.g. "Nirma University, Ahmedabad, India"')
    parser.add_argument("--out", required=True)
    args = parser.parse_args()

    G = ox.graph_from_place(args.place, network_type="drive")
    Gu = G.to_undirected()
    # Brandes' betweenness centrality — NetworkX ships this, do not hand-roll it
    edge_centrality = nx.edge_betweenness_centrality(Gu, weight="length", normalized=True)

    nodes_out = [{"id": str(n), "lat": data["y"], "lng": data["x"]} for n, data in G.nodes(data=True)]
    edges_out = []
    for u, v, data in G.edges(data=True):
        length_m = data.get("length", 50.0)
        
        # handle length_m being a list if there are multiple parallel edges flattened
        if isinstance(length_m, list):
            length_m = min(length_m)
            
        # extract maxspeed_ms safely
        maxspeed = data.get("maxspeed_ms", 8.0)
        if isinstance(maxspeed, list):
            # sometimes maxspeed can be a list of speeds in OSM data
            maxspeed = float(maxspeed[0]) if maxspeed else 8.0
        elif isinstance(maxspeed, str):
            try:
                maxspeed = float(maxspeed)
            except ValueError:
                maxspeed = 8.0
                
        base_travel_time_s = length_m / maxspeed
        centrality = edge_centrality.get((u, v), edge_centrality.get((v, u), 0.0))
        edges_out.append({
            "id": f"{u}-{v}", "from": str(u), "to": str(v),
            "lengthMeters": length_m, "baseTravelTimeSeconds": base_travel_time_s,
            "centralityScore": centrality,
        })

    with open(args.out, "w") as f:
        json.dump({"nodes": nodes_out, "edges": edges_out}, f)
    print(f"Wrote {len(nodes_out)} nodes and {len(edges_out)} edges to {args.out}")

if __name__ == "__main__":
    main()
