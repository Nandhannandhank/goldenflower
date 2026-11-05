const P = 'app/src/main/java/com/example/madlab/'

export default {
  id: 2,
  title: 'Announcement Feed',
  question: `Announcement Feed
• Plain text notice.
• Urgent alert.
• Image announcement.
• Action item with a button.
• Generate the list from a data source instead of separate hardcoded UI calls.`,
  gradle: [
    {
      name: 'app/build.gradle.kts',
      code: `// No extra dependencies needed.
// The default "Empty Activity" (Compose) template is enough.`,
    },
  ],
  manifest: null,
  files: [
    {
      name: 'Announcement.kt',
      path: P,
      code: `package com.example.madlab

// One class, four types of announcement
sealed class Announcement {
    data class Notice(val text: String) : Announcement()
    data class Urgent(val text: String) : Announcement()
    data class Photo(val caption: String) : Announcement()
    data class Action(val text: String, val button: String) : Announcement()
}

// The data source: the UI is generated from this list
val announcements = listOf(
    Announcement.Notice("Library will open at 9 AM tomorrow."),
    Announcement.Urgent("Exam hall changed to Block B!"),
    Announcement.Photo("Annual Day celebration"),
    Announcement.Action("Fee payment ends on Friday.", "Pay Now"),
    Announcement.Notice("Sports day practice at 4 PM.")
)
`,
    },
    {
      name: 'MainActivity.kt',
      path: P,
      code: `package com.example.madlab

import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                FeedScreen()
            }
        }
    }
}

@Composable
fun FeedScreen() {
    val context = LocalContext.current

    LazyColumn(Modifier.statusBarsPadding().padding(16.dp)) {
        items(announcements) { item ->
            when (item) {
                is Announcement.Notice -> {
                    Card(Modifier.fillMaxWidth().padding(vertical = 6.dp)) {
                        Text(item.text, Modifier.padding(16.dp))
                    }
                }
                is Announcement.Urgent -> {
                    Card(
                        Modifier.fillMaxWidth().padding(vertical = 6.dp),
                        colors = CardDefaults.cardColors(containerColor = Color(0xFFFFCDD2))
                    ) {
                        Text("URGENT: " + item.text, Modifier.padding(16.dp), color = Color.Red)
                    }
                }
                is Announcement.Photo -> {
                    Card(Modifier.fillMaxWidth().padding(vertical = 6.dp)) {
                        Column(Modifier.padding(16.dp)) {
                            Image(
                                painter = painterResource(id = android.R.drawable.ic_menu_gallery),
                                contentDescription = "Announcement image",
                                modifier = Modifier.size(100.dp)
                            )
                            Text(item.caption)
                        }
                    }
                }
                is Announcement.Action -> {
                    Card(Modifier.fillMaxWidth().padding(vertical = 6.dp)) {
                        Row(
                            Modifier.padding(16.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(item.text, Modifier.weight(1f))
                            Button(onClick = {
                                Toast.makeText(context, item.button + " clicked", Toast.LENGTH_SHORT).show()
                            }) {
                                Text(item.button)
                            }
                        }
                    }
                }
            }
        }
    }
}
`,
    },
  ],
  explain: [
    'sealed class Announcement lists the four kinds of announcement: Notice, Urgent, Photo and Action.',
    'The "announcements" list is the data source. To add a new announcement, only add one line to this list.',
    'LazyColumn + items(announcements) creates one row per list item, so there are no separate hardcoded UI calls.',
    '"when (item)" picks the correct card design for each type.',
    'The image uses a built-in Android icon, so you do not need to add any picture file.',
    'The Action card has a Button; clicking it shows a Toast message.',
  ],
}
