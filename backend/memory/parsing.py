import re
from langchain_core.runnables import RunnablePassthrough
import json
def extract_and_parse_content(message):
    """
    Extracts and parses the JSON content inside brackets following any prefix (e.g., System:, Response:).
    
    Args:
    message (str): The input message containing the JSON content.
    
    Returns:
    dict: The parsed JSON content if successful.
    None: If no match is found or there is a JSON decoding error.
    """
    try:
   
        start=message.find('{')
        json_string=message[start:]
        message_dict=json.loads(json_string)
        return message_dict
    except ValueError as e:
        print(f"Error parsing response string: {e}")
        return None
    

def parse_response_string_for_customchart(response_str):
    try:
        # Remove unnecessary characters and split by comma followed by newline
        response_cleaned = response_str.strip().replace('"', '')
        response_parts = response_cleaned.split(',\n')

        # Initialize an empty dictionary to store extracted parameters
        parameters = {}

        # Iterate over response parts and extract key-value pairs
        for part in response_parts:
            # Split each part into key and value
            key_value_pair = part.split(': ')
            # Ensure the key-value pair is valid
            if len(key_value_pair) == 2:
                key = key_value_pair[0].strip()
                value = key_value_pair[1].strip()
                parameters[key] = value

        return parameters

    except ValueError as e:
        print(f"Error parsing response string: {e}")
        return None