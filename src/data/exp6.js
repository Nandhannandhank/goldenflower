const P = 'app/src/main/java/com/example/madlab/'

export default {
  id: 6,
  title: 'Shopping Product List',
  question: `Shopping Product List
• Display product name, price and category.
• Clicking a product opens a Product Detail screen showing its information.

(Related to Experiment 3: simplest version, same basic pattern.)`,
  gradle: [
    {
      name: 'app/build.gradle.kts',
      code: `// No extra dependencies needed.
// (Experiment 3 needed Navigation Compose. This version does not.)`,
    },
  ],
  manifest: null,
  files: [
    {
      name: 'Product.kt',
      path: P,
      code: `package com.example.madlab

// Same file as Experiment 3
data class Product(val name: String, val price: Int, val category: String)

val products = listOf(
    Product("Laptop", 55000, "Electronics"),
    Product("Headphones", 1500, "Electronics"),
    Product("Shoes", 2500, "Fashion"),
    Product("Backpack", 1200, "Fashion"),
    Product("Notebook", 60, "Stationery")
)
`,
    },
    {
      name: 'MainActivity.kt',
      path: P,
      code: `package com.example.madlab

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                ShopApp()
            }
        }
    }
}

@Composable
fun ShopApp() {
    // null = show the list, not null = show the detail screen
    var selected by remember { mutableStateOf<Product?>(null) }

    // Phone back button returns to the list
    BackHandler(enabled = selected != null) { selected = null }

    val product = selected
    if (product == null) {
        ProductListScreen { p -> selected = p }
    } else {
        ProductDetailScreen(product) { selected = null }
    }
}

@Composable
fun ProductListScreen(onClick: (Product) -> Unit) {
    LazyColumn(Modifier.statusBarsPadding()) {
        items(products) { p ->
            Column(Modifier.fillMaxWidth().clickable { onClick(p) }.padding(16.dp)) {
                Text(p.name, style = MaterialTheme.typography.titleMedium)
                Text("Rs." + p.price + "  |  " + p.category)
            }
        }
    }
}

@Composable
fun ProductDetailScreen(product: Product, onBack: () -> Unit) {
    Column(Modifier.statusBarsPadding().padding(16.dp)) {
        Text("Product Detail", style = MaterialTheme.typography.headlineMedium)
        Text("Name: " + product.name)
        Text("Price: Rs." + product.price)
        Text("Category: " + product.category)
        Button(onClick = onBack) { Text("Back") }
    }
}
`,
    },
  ],
  explain: [
    'Same Product.kt and same list screen as Experiment 3, so there is less to memorise.',
    'Difference: there is no NavHost. One variable "selected" decides which screen is shown.',
    'selected = null means show the list. When a product is clicked, selected = that product and the detail screen appears.',
    'The Back button sets selected = null again. BackHandler makes the phone back button do the same.',
    'Use this version when the question only asks for a detail screen. Use Experiment 3 when "Navigation Compose" is asked.',
  ],
}
