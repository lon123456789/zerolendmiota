document.addEventListener('DOMContentLoaded', () => {
    const arrayPayments = [
        // {name: 'Сбер', logo: './img/plat/sber.png'}, {name: 'Тинькоф', logo: './img/plat/tbank.png'}, 
        { name: 'USDT', logo: './img/usdttrc.png' }, { name: 'ETH', logo: './img/eth.svg' }, { name: 'USDT', logo: './img/usdt.png' }, { name: 'BTC', logo: './img/Bitcoin.png' }, { name: 'BUSD', logo: './img/busd.png' }];
    divContainer = document.querySelector('.pay-container'),
        minShow = 3000,
        maxShow = 10000,
        elementsScore = 10;

    let arrayElements = [];

    if (localStorage.getItem('array')) {
        arrayElements = JSON.parse(localStorage.getItem('array'));
        if ((new Date().getTime() - arrayElements[elementsScore - 1].element.createTime) < 24 * 60 * 60 * 1000) {
            arrayElements.forEach(item => {
                render(item.element.text, item.createTime);
                timer(divContainer.querySelectorAll('tr'));
            });
        } else {
            generateRandom();
            timer(divContainer.querySelectorAll('tr'));
        }
    } else {
        generateRandom();
        timer(divContainer.querySelectorAll('tr'));
    }

    startInterval();

    function startInterval() {
        const interval = setInterval(() => {
            const itemsBlock = document.querySelectorAll('.pay-container tr'),
                element = new Element();

            if (itemsBlock && itemsBlock.length >= elementsScore) {
                itemsBlock[itemsBlock.length - 1].remove();
                arrayElements.shift()
            }

            arrayElements.push({ element: element, createTime: element.createTime });
            localStorage.setItem('array', JSON.stringify(arrayElements));

            render(element.text, element.createTime);
            timer(itemsBlock);

            clearInterval(interval);
            startInterval();
        }, getRandomArbitrary(minShow, maxShow));
    }

    function Element() {
        const date = new Date();
        let payWalletIndex;

        // const randomValue = Math.random();

        // if (randomValue < 0.4) {
        //     getRandomArbitrary(1, 3) == 1 ? payWalletIndex = 0 : payWalletIndex = 1;
        // } else {
        //     payWalletIndex = getRandomArbitrary(2, arrayPayments.length);
        // }

        payWalletIndex = getRandomArbitrary(0, arrayPayments.length);

        this.createTime = date.getTime();
        this.payments = arrayPayments[payWalletIndex].name;
        this.logo = arrayPayments[payWalletIndex].logo;
        this.operation = getRandomArbitrary(1, 3) == 1 ? 'Deposit' : 'Withdrawal';
        this.icon = this.operation == 'Deposit' ? './img/deposit.png' : './img/wirtdr.png';
        this.price = generatePrice(this.operation, this.payments);
        this.wallet = RandomWallet(payWalletIndex);
        this.text = `<td><img class="smile" src="${this.icon}"/></td> <td><div><b>Date/Time</b><span>sec ago</span></div></td> <td><div><b>Operation</b><p class="operation ${this.operation == 'Withdrawal' ? 'with' : 'dep'}"><i></i>${this.operation}</p></div></td> <td><div><b>Wallet</b><p>${this.wallet}</p></div></td> <td><div><b>Amount</b> <div><img src="${this.logo}"> ${this.price} USD</div></div></td>`;
    }

    function generateRandom() {
        for (let i = 0; i < elementsScore; i++) {
            const flag = getRandomArbitrary(1, 4),
                element = new Element();
            let createTime;

            if (flag == 1) {
                createTime = new Date().getTime() - (getRandomArbitrary(1, 60) * 1000);
                arrayElements.push({ element: element, createTime: createTime });
            } else if (flag == 2) {
                createTime = new Date().getTime() - (getRandomArbitrary(60, 3600) * 1000);
                arrayElements.push({ element: element, createTime: createTime });
            } else {
                createTime = new Date().getTime() - (getRandomArbitrary(3600, 82800) * 1000);
                arrayElements.push({ element: element, createTime: createTime });
            }
        }

        arrayElements.sort(function (a, b) {
            return a.createTime - b.createTime;
        });

        arrayElements.forEach(item => {
            render(item.element.text, item.createTime);
        })

        localStorage.setItem('array', JSON.stringify(arrayElements));
    }

    function getRandomArbitrary(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    function render(text, createTime) {
        const divItem = document.createElement('tr');

        //divContainer.appendChild(divItem);
        divContainer.insertBefore(divItem, divContainer.firstChild);
        divItem.setAttribute('value', createTime);
        divItem.innerHTML = text;
    }

    function timer(itemsBlock) {
        const dateNow = new Date().getTime();

        itemsBlock.forEach(item => {
            let timeAgo = Math.floor(dateNow - +item.getAttribute('value')) / 1000,
                span = item.querySelector('span');

            if (timeAgo >= 60 && timeAgo < 3600) {
                timeAgo = Math.floor(timeAgo / 60);
                span.textContent = ' ' + timeAgo + ' min ago';
            } else if (timeAgo > 3600) {
                timeAgo = Math.floor(timeAgo / 3600);
                span.textContent = ' ' + timeAgo + ' hour ago';
            } else {
                span.textContent = ' ' + Math.floor(timeAgo) + ' sec ago';
            }
        })
    }

    function RandomWallet(web) {
        let walletAddress;

        function someSybmols(n, walletAddress) {
            const alpha = 'qwertyuiopzxcvbnmasdfghjklQWERTYUIOPASDFGHJKLZXCVBNM1234567890';

            for (let i = 0; i < n; i++) {
                walletAddress += alpha[getRandomArbitrary(0, alpha.length)];
            }
            walletAddress = walletAddress.substr(0, 4) + "***" + walletAddress.substr(4);

            return walletAddress;
        }

        function getRandomDigits() {
            return getRandomArbitrary(1000, 9999);
        }

        function getRandomTinkoff() {
            const cardNumbers = ['5536', '5213', '4377', '0987'];
            return cardNumbers[getRandomArbitrary(0, cardNumbers.length)];
        }

        function getRandomSber() {
            const cardNumbers = ['2202', '4817', '5469', '4276'];
            return cardNumbers[getRandomArbitrary(0, cardNumbers.length)];
        }

        switch (web) {
            // case 0:
            //     walletAddress = `${getRandomSber()}****${getRandomDigits()}`;
            //     break;
            // case 1:
            //     walletAddress = `${getRandomTinkoff()}****${getRandomDigits()}`;
            //     break;
            case 0:
                walletAddress = 'T';
                walletAddress = someSybmols(7, walletAddress);
                break;
            case 1:
                walletAddress = '0x' + getRandomArbitrary(1, 7);
                walletAddress = someSybmols(7, walletAddress);
                break;
            case 2:
                walletAddress = '0x' + getRandomArbitrary(1, 7);
                walletAddress = someSybmols(7, walletAddress);
                break;
            case 3:
                walletAddress = 'bc1';
                walletAddress = someSybmols(5, walletAddress);
                break;
            case 4:
                walletAddress = '0x' + getRandomArbitrary(1, 7);
                walletAddress = someSybmols(5, walletAddress);
                break;
        }

        return walletAddress;
    }

    function generatePrice(operation, payments) {
        const alpha = getRandomArbitrary(1, 101);
        return randomValue(alpha, operation, payments);
    }

    function randomValue(alpha, operation = false, payments = false) {
        if (alpha < 40) {
            if (getRandomArbitrary(1, 3) == 1) {
                if (operation == 'Withdrawal' && (payments == 'USDT' || payments == 'BTC' || payments == 'ETH')) {
                    return Math.floor(getRandomArbitrary(25, 100));
                }else{
                    return Math.floor(getRandomArbitrary(10, 100));
                }
            } else {
                return Math.round(getRandomArbitrary(10, 100) / 10) * 10;
            }
        } else if (alpha >= 40 && alpha < 70) {
            if (getRandomArbitrary(1, 3) == 1) {
                return Math.floor(getRandomArbitrary(100, 350));
            } else {
                return Math.round(getRandomArbitrary(100, 350) / 10) * 10;
            }
        }
        else if (alpha >= 70 && alpha < 85) {
            if (getRandomArbitrary(1, 3) == 1) {
                return Math.floor(getRandomArbitrary(350, 1000));
            } else {
                return getRandomArbitrary(1, 3) == 1 ? (Math.round(getRandomArbitrary(350, 1000) / 100) * 100) : (Math.round(getRandomArbitrary(350, 1000) / 10) * 10);
                //return Math.round(getRandomArbitrary(4500, 15000) / 10) * 10;
            }
        }else if (alpha >= 85 && alpha < 95) {
            if (getRandomArbitrary(1, 3) == 1) {
                return Math.floor(getRandomArbitrary(1000, 1500));
            } else {
                return getRandomArbitrary(1, 3) == 1 ? (Math.round(getRandomArbitrary(1000, 1500) / 100) * 100) : (Math.round(getRandomArbitrary(1000, 1500) / 10) * 10);
                //return Math.round(getRandomArbitrary(15000, 100000) / 10) * 10;
            }
        } else {
            if (getRandomArbitrary(1, 3) == 1) {
                return Math.floor(getRandomArbitrary(1500, 3000));
            } else {
                return getRandomArbitrary(1, 3) == 1 ? (Math.round(getRandomArbitrary(1500, 3000) / 100) * 100) : (Math.round(getRandomArbitrary(1500, 3000) / 10) * 10);
            }
        }
    }
}) 