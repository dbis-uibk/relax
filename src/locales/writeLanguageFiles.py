#!/usr/bin/env python3

import csv, json

delimiter = ','
quotechar = '"'


def CsvToJson():
	language_data = {
		"en": {},
		"de": {},
		"es": {},
		"kr": {},
		"pt": {},
		"it": {}
	}
	with open('languages.csv', encoding="utf8") as csv_file:
		csv_reader = csv.reader(csv_file, delimiter=delimiter)
		rows = list(csv_reader)
		languages = rows[0][1:]
		for language in languages:
			language_data[language] = {}
		for row in rows[1:]:
			for i in range(1, len(row)):
				language_data[languages[i - 1]][row[0]] = row[i]
	for li in language_data.keys():
		with open('%s.json' % li, 'w', encoding='utf8') as json_file:
			json.dump(language_data[li], json_file, indent='\t', ensure_ascii=False) # Don't encode ascii - not necessary if output is opened as UTF8


def main():
	CsvToJson()


if __name__ == "__main__":
	main()
