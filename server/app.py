import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

# Wczytaj zmienne środowiskowe z pliku .env
load_dotenv()

# Inicjalizacja aplikacji Flask i CORS
app = Flask(__name__)
CORS(app, origins="http://localhost:3000", supports_credentials=True)

# Konfiguracja połączenia z DeepSeek
API_TOKEN = os.getenv("DEEPSEEK_API_KEY")
API_URL = "https://api.deepseek.com/chat/completions"

if not API_TOKEN:
    print("OSTRZEŻENIE: Brak klucza DEEPSEEK_API_KEY w pliku .env!")

headers = {
    "Authorization": f"Bearer {API_TOKEN}",
    "Content-Type": "application/json"
}

UNIVERSAL_VALUES = [
    "Rozwój", "Spokój", "Rodzina", "Uczciwość", "Kreatywność", "Bezpieczeństwo", 
    "Przygoda", "Zdrowie", "Natura", "Wolność", "Współpraca", "Akceptacja", 
    "Wytrwałość", "Empatia", "Radość", "Służba", "Dyscyplina", "Wiedza"
]

@app.route('/api/get-example-thoughts', methods=['GET'])
def get_example_thoughts():
    system_prompt = {
        "role": "system",
        "content": """
        Jesteś psychologiem. Twoim zadaniem jest wygenerowanie 4 krótkich, typowych, negatywnych myśli automatycznych w języku polskim, z którymi ludzie często się zmagają.
        Przykłady: "...jestem do niczego.", "...zawsze wszystko psuję.", "...to się na pewno nie uda.".
        Zwróć odpowiedź jako listę stringów w formacie JSON. Przykład: ["myśl 1", "myśl 2", "myśl 3", "myśl 4"].
        Odpowiedz tylko i wyłącznie samą listą JSON, bez żadnych dodatkowych słów i wyjaśnień.
        """
    }
    
    # Do tego zapytania nie potrzebujemy danych od użytkownika
    messages_payload = [system_prompt]
    payload = {
        "model": "deepseek-chat",
        "messages": messages_payload,
        "temperature": 1.2 # Zwiększamy "kreatywność" dla większej różnorodności
    }

    try:
        response = requests.post(API_URL, headers=headers, json=payload)
        response.raise_for_status()
        output_data = response.json()
        
        # Próbujemy sparsować odpowiedź AI, która powinna być stringiem JSON
        import json
        thoughts_list = json.loads(output_data['choices'][0]['message']['content'].strip())
        
        return jsonify(thoughts_list)

    except Exception as e:
        print(f"Błąd API w get-example-thoughts: {e}")
        # W razie błędu, zwróć statyczną listę zapasową
        fallback_thoughts = [
            "...jestem do niczego.",
            "...zawsze wszystko psuję.",
            "...to się na pewno nie uda.",
            "...co oni sobie o mnie pomyślą?"
        ]
        return jsonify(fallback_thoughts), 500
    
# === ENDPOINT 1: Do generowania pytania pomocniczego ===
@app.route('/api/get-reframing-question', methods=['POST'])
def get_reframing_question():
    data = request.json
    thought = data.get('thought')
    if not thought:
        return jsonify({"error": "No thought provided"}), 400

    system_prompt = {
    "role": "system",
    "content": """
    Jesteś ekspertem-psychoterapeutą, Twoim zadaniem jest pomoc użytkownikowi w zmianie perspektywy wobec negatywnej myśli za pomocą JEDNEGO pytania.

    Oto Twoja paleta metod terapeutycznych:
    1.  **Terapia Poznawczo-Behawioralna (CBT):** Koncentruje się na zniekształceniach poznawczych.
        -   Techniki: Testowanie dowodów, dekatastrofizacja, znajdowanie odcieni szarości.
        -   Kiedy używać: Gdy myśl jest wyraźnie nielogiczna, jest uogólnieniem ("zawsze", "nigdy") lub czarno-białą oceną.

    2.  **Terapia Akceptacji i Zaangażowania (ACT):** Koncentruje się na obserwowaniu myśli bez oceniania i działaniu w zgodzie z wartościami.
        -   Techniki: Defuzja poznawcza, badanie funkcji myśli/impulsu.
        -   Kiedy używać: Gdy myśl jest uporczywym impulsem, pragnieniem, lub gdy walka z nią jest bezcelowa. Pytaj o jej funkcję lub kontekst.

    3.  **Terapia Skoncentrowana na Rozwiązaniach (SFBT):** Koncentruje się na poszukiwaniu wyjątków i budowaniu pozytywnej przyszłości.
        -   Techniki: "Pytanie o cud", szukanie wyjątków od problemu.
        -   Kiedy używać: Gdy użytkownik czuje, że utknął i nie widzi wyjścia. Pytaj o momenty, kiedy problem nie występował.

    4.  **Logoterapia (Viktor Frankl):** Koncentruje się na poszukiwaniu sensu i celu.
        -   Techniki: Dialog sokratejski w poszukiwaniu sensu.
        -   Kiedy używać: Gdy myśl dotyczy poczucia beznadziei, pustki, braku sensu.

    5.  **Podejście Stoickie (Dychotomia Kontroli):** Koncentruje się na odróżnieniu tego, na co mamy wpływ, od tego, na co go nie mamy.
        -   Techniki: Analiza wpływu.
        -   Kiedy używać: Gdy myśl dotyczy zamartwiania się przyszłością lub działaniami innych ludzi.

    TWOJE ZADANIE:
    1.  Przeanalizuj wypowiedź użytkownika i wyizoluj z niej kluczową negatywną myśl lub przekonanie.
    2.  W ciszy zdiagnozuj, jaki jest główny mechanizm psychologiczny tej myśli.
    3.  Dobierz JEDNĄ, najodpowiedniejszą metodę terapeutyczną z powyższej listy.
    4.  Na podstawie tej metody, sformułuj JEDNO, otwarte i wspierające pytanie, które najskuteczniej pomoże użytkownikowi zdystansować się od jego myśli.
    5.  Twoja odpowiedź MUSI być tylko i wyłącznie samym pytaniem.
    """
}
    
    messages_payload = [system_prompt, {"role": "user", "content": thought}]
    payload = { "model": "deepseek-chat", "messages": messages_payload }

    try:
        response = requests.post(API_URL, headers=headers, json=payload)
        response.raise_for_status()
        output_data = response.json()
        question = output_data['choices'][0]['message']['content'].strip()
        return jsonify({"question": question})
    except Exception as e:
        print(f"Błąd API w get-reframing-question: {e}")
        return jsonify({"question": "Jak inaczej można spojrzeć na tę sytuację?"}), 500

# === ENDPOINT 2: Do generowania wniosku na koniec ćwiczenia ===
@app.route('/api/get-conclusion', methods=['POST'])
def get_conclusion():
    data = request.json
    negative_thought = data.get('negative_thought')
    user_answer = data.get('reframed_thought') 

    if not negative_thought or not user_answer:
        return jsonify({"error": "Brakujące dane do wygenerowania wniosku"}), 400

    system_prompt = {
        "role": "system",
        "content": """
        Jesteś psychologiem-coachem. Twoim zadaniem jest napisanie wnikliwego wniosku w formacie JSON na podstawie interakcji z użytkownikiem.
        Twoja odpowiedź MUSI być poprawnym obiektem JSON z następującymi kluczami: "diagnosisTitle", "diagnosisText", "discoveryText", "toolTitle", "toolText", "keyQuestion".
        Przykład: {"diagnosisTitle": "Zidentyfikowany Wzorzec", "diagnosisText": "Nadmierne uogólnianie", ...}
        Zwróć tylko i wyłącznie sam obiekt JSON, bez żadnych dodatkowych słów, wyjaśnień czy formatowania markdown.
        """
    }
    
    user_content = f"Myśl negatywna: \"{negative_thought}\"\nOdpowiedź użytkownika na pytanie pomocnicze: \"{user_answer}\""
    messages_payload = [system_prompt, {"role": "user", "content": user_content}]
    payload = { "model": "deepseek-chat", "messages": messages_payload }

    try:
        response = requests.post(API_URL, headers=headers, json=payload)
        response.raise_for_status()
        output_data = response.json()
        
        # --- NOWA, BARDZIEJ ODPORNA LOGIKA PARSOWANIA ---
        import json
        
        # 1. Pobieramy surową odpowiedź od AI
        raw_content = output_data['choices'][0]['message']['content'].strip()
        
        # 2. Szukamy, gdzie w tekście zaczyna się i kończy JSON
        start_index = raw_content.find('{')
        end_index = raw_content.rfind('}')
        
        if start_index != -1 and end_index != -1:
            # 3. "Wycinamy" czysty JSON ze stringa
            json_string = raw_content[start_index : end_index + 1]
            conclusion_object = json.loads(json_string)
            return jsonify(conclusion_object)
        else:
            # Jeśli w ogóle nie ma śladu JSON, zgłoś błąd
            raise ValueError("No JSON object found in AI response")
        # ----------------------------------------------------

    except Exception as e:
        # Ten print pokaże Ci w terminalu, co poszło nie tak
        print(f"Błąd API lub parsowania w get-conclusion: {e}") 
        
        # Zwracamy zapasowy obiekt o tej samej strukturze
        fallback_conclusion = {
          "diagnosisTitle": "Twoja Perspektywa",
          "diagnosisText": "Pozytywna Zmiana",
          "discoveryText": "Dobra robota! Świadoma praca z własnymi myślami jest kluczem do rozwoju.",
          "toolTitle": "Narzędzie na Przyszłość",
          "toolText": "Uważność",
          "keyQuestion": "Obserwuj swoje myśli bez oceny i pamiętaj, że masz wpływ na swoją perspektywę."
        }
        return jsonify(fallback_conclusion), 500

@app.route('/api/chat/values', methods=['POST'])
def handle_values_chat():
    data = request.json
    messages = data.get('messages')

    if not messages:
        return jsonify({"error": "No messages provided"}), 400

    system_prompt = {
        "role": "system",
        "content": f"""
        Jesteś coachem specjalizującym się w terapii ACT. Twoim zadaniem jest pomóc użytkownikowi skrystalizować jedną, najważniejszą dla niego w danym momencie wartość. Dostępne wartości to: {', '.join(UNIVERSAL_VALUES)}.

        Przebieg rozmowy:
        1. Użytkownik opisuje swój problem lub dylemat. Twoją odpowiedzią MUSI być jedno, krótkie pytanie klaryfikujące, które pomoże mu wybrać między dwoma potencjalnymi kierunkami (np. "Czy ważniejsza jest dla Ciebie stabilizacja czy nowe wyzwania?").
        2. Użytkownik odpowiada na Twoje pytanie.
        3. Twoim zadaniem jest przeanalizowanie jego odpowiedzi i ZAKOŃCZENIE rozmowy poprzez wskazanie jednej, najbardziej pasującej wartości. Twoja odpowiedź MUSI mieć format: "Rozumiem. W tej sytuacji kluczową wartością wydaje się być **[Nazwa Wartości]**.". Użyj pogrubienia.
        
        Bądź zwięzły i empatyczny.
        """
    }
    
    messages_with_system_prompt = [system_prompt] + messages
    payload = { "model": "deepseek-chat", "messages": messages_with_system_prompt }

    try:
        response = requests.post(API_URL, headers=headers, json=payload) # Użyj API_URL, który zdefiniowałeś na początku
        response.raise_for_status()
        output_data = response.json()
        ai_message = output_data['choices'][0]['message']['content'].strip()
        
        return jsonify({"ai_response": ai_message})
    except Exception as e:
        app.logger.error(f"Błąd API w values-chat: {e}")
        return jsonify({"error": "Błąd serwera AI"}), 500

# Główna funkcja uruchamiająca serwer
if __name__ == '__main__':
    app.run(debug=True, port=5001)