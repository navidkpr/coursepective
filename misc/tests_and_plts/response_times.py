import json
import requests as rq
import time
import seaborn as sns
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd

base_backend_url = 'http://127.0.0.1:8000'


def cdf(df, api_types=['insert_review', 'get_reviews', 'get_courses']):

    data = {i: df[(df.TimeType == api_types[i])] for i in range(len(
        api_types))}
    plot_data = []

    for i, api in enumerate(api_types):

        rt = data[i].RT.sort_values()
        yvals = np.arange(len(rt)) / float(len(rt))

        # Append it to the data
        colour_marker = [api]*len(yvals)

        df = pd.DataFrame(dict(dens=yvals, dv=rt, apis=colour_marker))
        plot_data.append(df)

    plot_data = pd.concat(plot_data, axis=0)

    return plot_data

def cdf_plot(cdf_data, save_file=False, legend=True):
    sns.set_style('white')
    sns.set_style('ticks')
    g = sns.FacetGrid(cdf_data, hue="apis", height= 6)
    g.map(plt.plot, "dv", "dens", alpha=.7, linewidth=1)
    plt.text(0.2, 0.77, '75th Percentile',  color='red')
    plt.axhline(y=0.75, lw=0.8, ls='--', c='red', label='75th percentile')
    
    if legend:
        
        # plt.legend(title="APIs")
        g.add_legend(title="APIs")
        
    g.set_axis_labels("Response Time (seconds)", "Probability")
    g.fig.suptitle('Response Time CDFs for Most Common API calls')

    if save_file:
        g.savefig("cdf_response-time.png")

    plt.show()




def get_times(filename):
    update_times = []
    get_review_times = []
    get_course_times = []
    for i in range(100):
        body = {
            'rating': f'{i%5 + 1}',
            'courseId': "4a7756ff-1d50-4642-8676-e7834ed9b0c1",
            'userEmail': "robchay@rogers.com",
            'comments': "YEET"
        }
        start_time = time.time()
        resp = rq.patch(f'{base_backend_url}/reviews', data=body)
        time_taken = round(time.time() - start_time, 3)
        # print(time_taken)
        update_times.append(time_taken)

    for i in range(100):
        start_time = time.time()
        resp = rq.get(f'{base_backend_url}/reviews/course/4a7756ff-1d50-4642-8676-e7834ed9b0c1')
        time_taken = round(time.time() - start_time, 3)
        # json_resp = resp.json()
        # print(json_resp)
        # print(time_taken)
        get_review_times.append(time_taken)

    for i in range(100):
        body = {
            'searchString': 'ECE'
        }
        start_time = time.time()
        resp = rq.post(f'{base_backend_url}/courses/search', data=body)
        time_taken = round(time.time() - start_time, 3)
        # json_resp = resp.json()
        # print(json_resp)
        # print(time_taken)
        get_course_times.append(time_taken)
        



    frame = pd.DataFrame(data={
        'TimeType': ['insert_review']*100 + ['get_review']*100 + ['get_course']*100,
        'RT': update_times+get_review_times+get_course_times
    })
    with open(filename, 'w') as f:
        1 == 1
        
    frame.to_csv(filename)

    
filename = 'new_data.csv'

# get_times(filename)
# frame = pd.read_csv(filename)

frame = pd.read_csv('times.csv')


cdf_dat = cdf(frame)
cdf_plot(cdf_dat, legend=True, save_file=True)

print("75th percentile average of apis is : " + str(cdf_dat.query('dens == 0.75')['dv'].mean())) # average of the 75th percentile times across all common apis





    


