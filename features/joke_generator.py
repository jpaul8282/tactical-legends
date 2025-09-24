import requests

def get_random_joke():
    """
    Fetches a random joke from the Official Joke API.
    Returns:
        str: The joke (setup and punchline), or an error message.
    """
    url = "https://official-joke-api.appspot.com/random_joke"
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        joke = response.json()
        return f"{joke['setup']}\n{joke['punchline']}"
    except Exception as e:
        return f"Error fetching joke: {e}"

if __name__ == "__main__":
    print(get_random_joke())