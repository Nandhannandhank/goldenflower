const P = 'app/src/main/java/com/example/madlab/'

export default {
  id: 1,
  title: 'Food Ordering App',
  question: `Food Ordering App
• Menu screen with food items.
• Order Summary screen.
• Pass order information using Explicit Intent.
• Demonstrate a simple Compose animation.`,
  gradle: [
    {
      name: 'app/build.gradle.kts',
      code: `// No extra dependencies needed.
// The default "Empty Activity" (Compose) template is enough.`,
    },
  ],
  manifest: `<application ...>

    <activity android:name=".MainActivity" ... />

    <!-- ADD this line inside <application> -->
    <activity android:name=".OrderActivity" />

</application>`,
  files: [
    {
      name: 'MainActivity.kt',
      path: P,
      code: `package com.example.madlab

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                MenuScreen()
            }
        }
    }
}

@Composable
fun MenuScreen() {
    val context = LocalContext.current
    val menu = listOf("Burger" to 120, "Pizza" to 250, "Pasta" to 180, "Fries" to 90)
    val cart = remember { mutableStateListOf<String>() }

    Column(Modifier.statusBarsPadding().padding(16.dp)) {
        Text("Menu", style = MaterialTheme.typography.headlineMedium)

        menu.forEach { (name, price) ->
            Row(
                Modifier.fillMaxWidth().padding(vertical = 8.dp),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(name + " - Rs." + price)
                Button(onClick = { cart.add(name) }) { Text("Add") }
            }
        }

        // Compose animation: this text fades/slides in when the cart is not empty
        AnimatedVisibility(visible = cart.isNotEmpty()) {
            Text("Items in cart: " + cart.size)
        }

        Button(
            enabled = cart.isNotEmpty(),
            onClick = {
                val total = cart.sumOf { item -> menu.first { it.first == item }.second }
                val intent = Intent(context, OrderActivity::class.java)
                intent.putStringArrayListExtra("items", ArrayList(cart))
                intent.putExtra("total", total)
                context.startActivity(intent)
            }
        ) {
            Text("Place Order")
        }
    }
}
`,
    },
    {
      name: 'OrderActivity.kt',
      path: P,
      code: `package com.example.madlab

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

class OrderActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Receive the data sent by MainActivity
        val items = intent.getStringArrayListExtra("items") ?: arrayListOf()
        val total = intent.getIntExtra("total", 0)

        setContent {
            MaterialTheme {
                Column(Modifier.statusBarsPadding().padding(16.dp)) {
                    Text("Order Summary", style = MaterialTheme.typography.headlineMedium)
                    items.forEach { Text(it) }
                    Text("Total: Rs." + total, style = MaterialTheme.typography.titleLarge)
                    Button(onClick = { finish() }) { Text("Back") }
                }
            }
        }
    }
}
`,
    },
  ],
  explain: [
    'MenuScreen shows the food list. Each "Add" button puts the food name into the cart list.',
    'mutableStateListOf makes the screen update automatically when the cart changes.',
    'AnimatedVisibility is the simple Compose animation: the cart text slides/fades in after the first item is added.',
    'Explicit Intent = Intent(context, OrderActivity::class.java). We name the exact activity to open.',
    'putStringArrayListExtra / putExtra send the data. OrderActivity reads it with getStringArrayListExtra / getIntExtra.',
    'Every activity must be declared in AndroidManifest.xml, so OrderActivity is added there.',
  ],
}
