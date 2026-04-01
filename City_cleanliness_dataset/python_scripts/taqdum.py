from tqdm import tqdm
import time
import random

for i in tqdm(range(100)):
    # Simulate some work
    time.sleep(0.01)

for _ in tqdm(range(20000000), desc="Processing large range"):
	continue

# # Function generating random number between 1 and 100
# def generate_random_numbers():
# 	while True:
# 	        yield random.randint(1, 100)
 
# # Without total: tqdm() only shows number of iterations, does not know total
# for num in tqdm(generate_random_numbers(), desc="Random Iteration"):
# 	time.sleep(0.01)
# 	# …