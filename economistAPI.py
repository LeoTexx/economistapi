import bs4 as bs
import requests
from urllib.request import Request, urlopen
import json

def api_economist():
    news_json = {}

    #setting the request
    req = Request('https://www.economist.com', headers={'User-Agent': 'Mozilla/5.0'})
    source = urlopen(req).read()
    soup = bs.BeautifulSoup(source,'lxml')

    #parsing the data
    news = soup.find_all('div',{'data-test-id': 'Article Teaser'})

    counter = 0
    for index in news:
        title = index.find('h3').getText()
        description = index.find('p',{'data-test-id': 'Description'}).getText()

        #some images does not have images in the main website
        try:
            imageUrl = index.find('img')['src']
        except:
            imageUrl = None

        news_json[counter] = [{'title':title}, {'description':description}, {'image':imageUrl}]
        counter += 1


    return json.dumps(news_json)


print(api_economist())