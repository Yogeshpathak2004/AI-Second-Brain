from neo4j import GraphDatabase


class Neo4jManager:
    """
    Handles knowledge graph operations using Neo4j.
    """

    def __init__(
        self,
        uri: str,
        username: str,
        password: str
    ):
        self.driver = GraphDatabase.driver(
            uri,
            auth=(username, password)
        )

    def close(self):
        self.driver.close()

    def create_entity(
        self,
        entity_name: str,
        entity_type: str = "Entity"
    ):
        query = f"""
        MERGE (e:{entity_type} {{name: $name}})
        RETURN e
        """

        with self.driver.session() as session:
            return session.run(
                query,
                name=entity_name
            ).single()

    def create_relationship(
        self,
        source: str,
        relationship: str,
        target: str
    ):
        query = f"""
        MERGE (a:Entity {{name: $source}})
        MERGE (b:Entity {{name: $target}})
        MERGE (a)-[r:RELATED_TO {{type: $relationship}}]->(b)
        RETURN a, r, b
        """

        with self.driver.session() as session:
            return session.run(
                query,
                source=source,
                target=target,
                relationship=relationship
            ).single()

    def get_related_entities(
        self,
        entity_name: str
    ):

        query = """
        MATCH (a {name: $name})-[r]-(b)
        RETURN b.name AS entity,
               type(r) AS relationship
        """

        with self.driver.session() as session:

            result = session.run(
                query,
                name=entity_name
            )

            return [
                record.data()
                for record in result
            ]