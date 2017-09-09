# mktmaker

problem:
1. Need to know the price of the stock when that reach some price point to sell it. Store the price details to DB. Note: Public api's don't have the real time support.
2. Need to set alert for the stocks on specific price. This has to be pushed to mobile.
3. Need to simulate the buy, sell cases based on the real time price change. Store the details into DB.
4. After analysis of the above steps. Try on individual rel time market API to buy and sell. - Ultimate goal.

solution:
1. Since public api's don't offer realtime price we need to scrape it from some websites which provides live proce details.
2. Let's use socket.io for notification.
3. Simulating buy, sell need to defined in more details.
4. YTD.
