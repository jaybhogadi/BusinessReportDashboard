import json
def load_prompts(file_path):
    with open(file_path,'r') as f:
        prompt_data=json.load(f)
    return prompt_data['prompts']