const P = 'app/src/main/java/com/example/madlab/'

export default {
  id: 3,
  title: 'Shopping App with Navigation Compose',
  question: `Shopping App with Navigation Compose
• Display product name, price and category.
• Clicking a product opens the Product Detail screen.
• Pass selected product information using Navigation Compose.`,
  gradle: [
    {
      name: 'app/build.gradle.kts',
      code: `dependencies {
    // ADD this line
    implementation("androidx.navigation:navigation-compose:2.8.4")
}`,
    },
  ],
  manifest: null,
  files: [
    {
      name: 'Product.kt',
      path: P,
      code: `package com.example.madlab

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
import androidx.activity.compose.setContent
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController

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
    val navController = rememberNavController()

    NavHost(navController = navController, startDestination = "list") {

        // Screen 1: product list
        composable("list") {
            ProductListScreen { p ->
                navController.navigate("detail/" + p.name + "/" + p.price + "/" + p.category)
            }
        }

        // Screen 2: product detail (receives name, price, category)
        composable("detail/{name}/{price}/{category}") { entry ->
            val name = entry.arguments?.getString("name") ?: ""
            val price = entry.arguments?.getString("price") ?: ""
            val category = entry.arguments?.getString("category") ?: ""
            ProductDetailScreen(name, price, category) { navController.popBackStack() }
        }
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
fun ProductDetailScreen(name: String, price: String, category: String, onBack: () -> Unit) {
    Column(Modifier.statusBarsPadding().padding(16.dp)) {
        Text("Product Detail", style = MaterialTheme.typography.headlineMedium)
        Text("Name: " + name)
        Text("Price: Rs." + price)
        Text("Category: " + category)
        Button(onClick = onBack) { Text("Back") }
    }
}
`,
    },
  ],
  explain: [
    'Product.kt holds the data class and the product list.',
    'NavHost is the container for all screens. Each composable("route") is one screen.',
    'The route "detail/{name}/{price}/{category}" has placeholders. When we call navigate("detail/Laptop/55000/Electronics"), the placeholders are filled with these values.',
    'In the detail screen, entry.arguments?.getString("name") reads the passed value.',
    'popBackStack() goes back to the previous screen.',
    'Product names have no spaces so the route stays simple and safe.',
  ],
}
