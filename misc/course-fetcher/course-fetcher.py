import requests
from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup

def get_html_from_url(url):
    print('getting content')
    p = sync_playwright().start()
    browser = p.webkit.launch()
    page = browser.new_page()
    page.goto(url)
    print('got page')
    content = page.content()
    print('got content')
    return content
    # page.screenshot(path=f'example-{browser_type.name}.png')
    # headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'}

    # response = requests.get(url, headers=headers)
    # return response.content

def get_products_from_url(url):
    # url = "https://google.com"
    html = get_html_from_url(url) 
    # f = open("test.html", "w")
    # f.write(html)
    # f.close()
    soup = BeautifulSoup(html, 'html.parser')

    furnitures = []
    for item in soup.select('.TrackedProductCardWrapper-inView'):
        furniture = {}
        try:
            # Skip item if out of stock
            if len(item.select('.OutOfStockOverlay-text')) > 0:
                continue

            # Get name
            try:
                product_name = item.select('h2')[0].get_text().strip()
            except:
                print('product name missing')
                continue
            furniture['product_name'] = product_name

            # Get link
            try:
                product_link = item.select('a')[0]['href']
            except:
                print('product_link missing')
                continue
            furniture['product_page_url'] = product_link

            # Get image
            try:
                product_image_url = item.select('img')[0]['src']
            except:
                print('product image missing')
                continue
            furniture['image_url'] = product_image_url

            # Get price
            product_costs = []
            try:
                for potential_cost in item.select('.SFPrice')[0].select('span'):
                    curr_potential_cost = extract_price_from_string(potential_cost.get_text())
                    if curr_potential_cost is not None:
                        product_costs.append(curr_potential_cost)
                product_cost = min(product_costs)
            except Exception as ee:
                print("Error Found", ee)
                product_cost = None
                continue
            furniture['sale_price'] = product_cost
            furnitures.append(furniture)
        except Exception as e:
            print('FOUND ERROR:', e)
            pass
    return furnitures

# crawler = Crawler()
# wayfair_url = "https://www.wayfair.com/furniture/sb0/sofas-c413892.html"
# products = crawler.get_products_from_url('https://www.wayfair.com/furniture/sb0/sofas-c413892.html')
# print(products)
