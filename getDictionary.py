import requests
import json
import time

final_dict = {}
final_name_list = []

API_URL = "https://starwars-databank-server.vercel.app/api/v1/vehicles"

def remove_double_quotes(string_with_quotes):
    # Remove the double quotes from the string
    simple_string = string_with_quotes.replace('"', '')
    return simple_string

def fill_dictionary_once():
    start_time = time.time()

    api_url = API_URL
    next_page = ''

    if not final_dict:
        while next_page is not None:
            try:
                response = requests.get(api_url)
                response.raise_for_status()  # Raise an exception for 4xx or 5xx status codes
                json_data = response.json()

                data_list = json_data.get("data", [])
                for entry in data_list:
                    processed_name = remove_double_quotes(entry["name"])
                    final_dict[processed_name] = entry["_id"]
                    final_name_list.append(processed_name)

                next_page = json_data.get("info", {}).get("next")
                api_url = f"https://starwars-databank-server.vercel.app{next_page}"
                print(api_url)
            except requests.exceptions.RequestException as e:
                print("Error fetching JSON from API:", e)
                return
            
    end_time = time.time()

    print(end_time-start_time)

    print(final_dict)  # DEBUG
    print(final_name_list)  # DEBUG

def save_to_file(filename,myContainer):
    with open(filename, 'w') as file:
        json.dump(myContainer, file)

if __name__ == "__main__":
    fill_dictionary_once()
    save_to_file('final_dict.json',final_dict)
    save_to_file('final_names.json',final_name_list)
