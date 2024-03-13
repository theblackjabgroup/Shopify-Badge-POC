document.addEventListener('DOMContentLoaded', function () {
  bdgs_finditems();
});

//dom-load -> bdgs_finditems (get all the images)-> identifyProductfromReq -> decodeJson & addBadge  -> my_badge

  

async function decodeJson() {
  try {
    // Make an HTTP GET request to the server-side endpoint
    const response = await fetch('http://localhost:3000/api/data');
    // get the products that need badge

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const obj = await response.json();
    console.log('obj ', obj);
    return obj.data.data.products.edges;
  }
  catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    return [];
  }
}

function addBadge(productDOM) {
  for (var idx = 0; idx < productDOM.length; idx++) {
    const imgTag = productDOM[idx].querySelectorAll('img');
    console.log('productDOM[idx] ', productDOM[idx]);
    my_badge(productDOM[idx]);
  }
}

function identifyProductfromReq() {
  decodeJson().then(edges => {
    for (let index = 0; index < edges.length; index++) {
      if (domMAP.has(edges[index].node.handle)) {
        console.log(
          'key ',
          edges[index].node.handle,
          ' value ',
          domMAP.get(edges[index].node.handle)
        );
        addBadge(domMAP.get(edges[index].node.handle));
      }
    }
  }).catch(error => {
    console.error('Error fetching JSON in identifyProductfromReq:', error);
  });
}


const domMAP = new Map(); //map of product names and the closest img DOM array

function bdgs_finditems() {
  for (
    var t = [],
    e = [],
    s = document.querySelectorAll(
      'a[href*="/products/"]:not([href*=".jp"]):not([href*=".JP"]):not([href*=".png"]):not([href*=".PNG"]):not([href*="facebook.com"]):not([href*="twitter.com"]):not([href*="pinterest.com"]):not([href*="mailto:"])'
    ),
    // find the location of the images
    a = 0;
    a < s.length;
    a++
  ) {
    console.log('s[a] ', s[a]); // print each of the images
    var l;
    if (0 < (g = s[a].getAttribute('href').split('/'))[g.length - 1].split(/[?#]/)[0].length) {
      l = 1;
    } else {
      l = 2; // l is frm where to extract product name ,second to last or third to last
    }
    var p = g[g.length - l].split(/[?#]/)[0];
    var t = decodeURI(p); // t is the product name eg: Test
    let parentElement = s[a].parentElement; 
    var closestImgDOM;
    var imgFound = false;
    while (parentElement) { //check if image is there
      closestImgDOM = parentElement.querySelector(
        'img[src*="/products/"]:not([class*="not-abel"]), img[data-src*="/products/"]:not([class*="not-label"]), img[src*="/no-image"], img[data-src*="/no-image"], img[src*="/products/"], img[srcset*="/products/"][srcset*="/cdn.shopify.com/s/files/"], img[src*="/cdn.shopify.com/s/files/"], source[data-srcset*="/products/"],  source[data-srcset*="/cdn.shopify.com/s/files/"], source[data-srcset*="/cdn/shop/files/"],  img[data-srcset*="/cdn.shopify.com/s/files/"],  img[src*="/product_img/"],  img[src*="/cdn/shop/files/"],  img[srcset*="/cdn/shop/files/"], img[srcset*="/cdn/shop/products/"], [style*="/products/"], img[src*="%2Fproducts%2F"]'
      );
      if (closestImgDOM != null) {
        imgFound = true;
        break;
      }
      parentElement = parentElement.parentElement;
    }
    console.log('closestImg ', closestImgDOM);
    if (domMAP.has(t)) {
      const domArray = domMAP.get(t);
      domArray.push(closestImgDOM);
      domMAP.set(t, domArray);
    } else {
      domMAP.set(t, [closestImgDOM]); // add a mapping of product name and image
    }
  }
  console.log("domMap ", domMAP);
  identifyProductfromReq();
}

function my_badge(s) {
  var a = document.createElement('div');
  a.className = 'product-image-container';
  var labelImage = document.createElement('div');
  labelImage.className = 'badge_itm';
  labelImage.style.backgroundColor = 'transparent';
  labelImage.style.backgroundSize = 'contain';
  labelImage.style.padding = '17%';
  labelImage.style.backgroundImage =
    "url('https://cdn.shopify.com/s/files/1/0858/1470/6469/files/pngtree-badge-png-image_996483.jpg?v=1708857907')";
  labelImage.style.display = 'block';
  labelImage.style.position = 'absolute';
  labelImage.style.zIndex = '100px';
  labelImage.style.borderRadius = '0px';
  a.appendChild(labelImage);
  var parentNode = s.parentNode;
  parentNode.appendChild(a);
}
