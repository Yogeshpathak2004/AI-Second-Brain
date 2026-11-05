import requests
from typing import Optional


class OllamaClient:
    """
    Client for communicating with the local Ollama server.
    """

    def __init__(
        self,
        base_url: str = "http://localhost:11434",
        model: str = "llama3.2"
    ):
        self.base_url = base_url.rstrip("/")
        self.model = model

    def generate(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        temperature: float = 0.2
    ) -> str:
        """
        Send a prompt to Ollama and return the generated response.
        """

        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": temperature
            }
        }

        if system_prompt:
            payload["system"] = system_prompt

        try:
            response = requests.post(
                f"{self.base_url}/api/generate",
                json=payload,
                timeout=120
            )

            response.raise_for_status()

            data = response.json()

            return data.get("response", "").strip()

        except requests.exceptions.ConnectionError:
            raise ConnectionError(
                "Could not connect to Ollama. "
                "Make sure Ollama is installed and running."
            )

        except requests.exceptions.Timeout:
            raise TimeoutError(
                "Ollama took too long to respond."
            )

        except requests.exceptions.RequestException as error:
            raise RuntimeError(
                f"Ollama request failed: {error}"
            )

    def chat(self, messages: list[dict]) -> str:
        """
        Send a conversation to Ollama using the chat API.
        """

        payload = {
            "model": self.model,
            "messages": messages,
            "stream": False
        }

        try:
            response = requests.post(
                f"{self.base_url}/api/chat",
                json=payload,
                timeout=120
            )

            response.raise_for_status()

            data = response.json()

            return data.get("message", {}).get("content", "").strip()

        except requests.exceptions.ConnectionError:
            raise ConnectionError(
                "Could not connect to Ollama. "
                "Make sure Ollama is installed and running."
            )

        except requests.exceptions.Timeout:
            raise TimeoutError(
                "Ollama took too long to respond."
            )

        except requests.exceptions.RequestException as error:
            raise RuntimeError(
                f"Ollama chat request failed: {error}"
            )