#!/usr/bin/env python3

from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.firefox.options import Options
import json
import sys
import argparse
import base64


class element_not_empty(object):
    def __init__(self, locator):
        self.locator = locator

    def __call__(self, driver):
        element = driver.find_element(*self.locator)
        if element.text != "":
            return element
        else:
            return False


def main():
    parser = argparse.ArgumentParser(description='Relax Query Tool')
    parser.add_argument('--local', help='Local Dataset',
                        default=False, action='store_true')
    parser.add_argument(
        '--dataset', help='The dataset to be used', required=True)
    parser.add_argument(
        '--query', help='The query which should be executed', required=True)
    args = parser.parse_args()

    # http://dbis-uibk.github.io/relax/api/local/uibk/local/0?query=UiBqb2luIFMgam9pbiBU
    # ./relaxCLI.py --local --dataset uibk/local/0 --query "R join S"
    url = "http://dbis-uibk.github.io/relax/api/%s/%s?query=%s" % (
        "local" if args.local else "gist",
        args.dataset,
        str(base64.b64encode(args.query.encode("utf-8")), "utf-8")
    )

    options = Options()
    options.headless = True
    driver = webdriver.Firefox(options=options)
    driver.get(url)
    successDiv = WebDriverWait(driver, 30).until(
        element_not_empty((By.ID, "success")))
    queryDiv = driver.find_element_by_id("query")
    resultDiv = driver.find_element_by_id("result")

    success = successDiv.text == "true"
    if (success):
        print("Query: [%s] succeeded!" % queryDiv.text)
        result = json.loads(resultDiv.text)
        print(result)
    else:
        print("Query: [%s] failed: %s" % (queryDiv.text, resultDiv.text))


if __name__ == "__main__":
    main()
