with open("src/lib/fallbackGenerator.ts", "r") as f:
    content = f.read()

# Let's add mappings for the new real entities in english, french, spanish, polish, arabic
new_mappings = {
    "english": {
        "Fondazione Roma Litorale": "Roma Litorale Foundation",
        "Fondazione Roma Litorale - Agenzia Lavoro": "Roma Litorale Foundation - Employment Agency",
        "Fondazione Roma Litorale - Agenzia Lavoro Ostia": "Roma Litorale Foundation - Ostia Employment Agency",
        "Cooperativa Sociale Futura Onlus": "Futura Onlus Social Cooperative",
        "Assistenza e Territorio - Soc. Coop. Sociale Onlus": "Assistenza e Territorio Social Cooperative",
        "PrivatAssistenza Ostia Lido": "PrivatAssistenza Ostia Lido",
        "Cooperativa Lido": "Lido Cooperative",
        "Studio Eurogiga (Servizi e Payroll Ostia)": "Studio Eurogiga (Ostia Payroll & Services)",
        "Adecco Filiale Fiumicino": "Adecco Fiumicino Branch",
        "Randstad Italia - Filiale Roma EUR": "Randstad Italy - Rome EUR Branch",
        "CPIA 7 Sede Ostia 1 (Levante)": "CPIA 7 Ostia 1 Center (East)",
        "CPIA 7 Sede Ostia 2 (Ponente)": "CPIA 7 Ostia 2 Center (West)",
        "Corsi di Italiano Biblioteca Elsa Morante": "Elsa Morante Library Italian Courses",
    },
    "arabic": {
        "Fondazione Roma Litorale": "مؤسسة روما ليتورالي",
        "Fondazione Roma Litorale - Agenzia Lavoro": "مؤسسة روما ليتورالي - وكالة التوظيف",
        "Fondazione Roma Litorale - Agenzia Lavoro Ostia": "مؤسسة روما ليتورالي - وكالة توظيف أوستيا",
        "Cooperativa Sociale Futura Onlus": "التعاونية الاجتماعية فوتورا",
        "Assistenza e Territorio - Soc. Coop. Sociale Onlus": "التعاونية الاجتماعية المساعدة والإقليم",
        "PrivatAssistenza Ostia Lido": "بريفات أسيستنزا أوستيا ليدو",
        "Cooperativa Lido": "تعاونية ليدو",
        "Studio Eurogiga (Servizi e Payroll Ostia)": "استوديو يوروجيجا (خدمات أوستيا)",
        "Adecco Filiale Fiumicino": "أديكو - فرع فيوميتشينو",
        "Randstad Italia - Filiale Roma EUR": "رانستاد إيطاليا - فرع روما يور",
        "CPIA 7 Sede Ostia 1 (Levante)": "CPIA 7 مركز أوستيا 1",
        "CPIA 7 Sede Ostia 2 (Ponente)": "CPIA 7 مركز أوستيا 2",
        "Corsi di Italiano Biblioteca Elsa Morante": "دورات اللغة الإيطالية بمكتبة إلسا مورانتي",
    }
}

for lang, d in new_mappings.items():
    marker = f"{lang}: {{"
    pos = content.find(marker)
    if pos != -1:
        insert_pos = pos + len(marker)
        chunk = "\n" + "\n".join([f'    "{k}": "{v}",' for k, v in d.items()])
        content = content[:insert_pos] + chunk + content[insert_pos:]

with open("src/lib/fallbackGenerator.ts", "w") as f:
    f.write(content)

print("Updated fallbackGenerator.ts with real entities translations!")
