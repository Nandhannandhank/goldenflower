const P = 'app/src/main/java/com/example/madlab/'

export default {
  id: 8,
  title: 'REST API using Retrofit',
  question: `REST API using Retrofit
• Fetch comments from https://jsonplaceholder.typicode.com/comments.
• Use Retrofit.
• Display a progress indicator while loading.
• Display comment name and email.`,
  gradle: [
    {
      name: 'app/build.gradle.kts',
      code: `dependencies {
    // ADD these lines
    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    implementation("com.squareup.retrofit2:converter-gson:2.9.0")
}`,
    },
  ],
  manifest: `<manifest ...>

    <!-- ADD this line above <application> -->
    <uses-permission android:name="android.permission.INTERNET" />

    <application ...>
        ...
    </application>
</manifest>`,
  files: [
    {
      name: 'Comment.kt',
      path: P,
      code: `package com.example.madlab

data class Comment(
    val postId: Int,
    val id: Int,
    val name: String,
    val email: String,
    val body: String
)
`,
    },
    {
      name: 'ApiService.kt',
      path: P,
      code: `package com.example.madlab

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.GET

interface ApiService {
    @GET("comments")
    suspend fun getComments(): List<Comment>
}

object RetrofitInstance {
    val api: ApiService = Retrofit.Builder()
        .baseUrl("https://jsonplaceholder.typicode.com/")
        .addConverterFactory(GsonConverterFactory.create())
        .build()
        .create(ApiService::class.java)
}
`,
    },
    {
      name: 'MainActivity.kt',
      path: P,
      code: `package com.example.madlab

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                CommentScreen()
            }
        }
    }
}

@Composable
fun CommentScreen() {
    var comments by remember { mutableStateOf<List<Comment>>(emptyList()) }
    var loading by remember { mutableStateOf(true) }
    var error by remember { mutableStateOf("") }

    // Runs once when the screen opens
    LaunchedEffect(Unit) {
        try {
            comments = RetrofitInstance.api.getComments()
        } catch (e: Exception) {
            error = "Could not load comments"
        }
        loading = false
    }

    Box(Modifier.fillMaxSize().statusBarsPadding(), contentAlignment = Alignment.Center) {
        if (loading) {
            CircularProgressIndicator()
        } else if (error.isNotEmpty()) {
            Text(error)
        } else {
            LazyColumn(Modifier.fillMaxSize()) {
                items(comments) { c ->
                    Column(Modifier.padding(12.dp)) {
                        Text(c.name, style = MaterialTheme.typography.titleSmall)
                        Text(c.email)
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
    'Comment is a data class with the same field names as the JSON from the website, so Gson converts it automatically.',
    'ApiService describes the request: @GET("comments") added to the base URL gives https://jsonplaceholder.typicode.com/comments.',
    'RetrofitInstance builds Retrofit once, with Gson as the JSON converter.',
    'suspend fun means the network call runs without freezing the screen. It is called inside LaunchedEffect.',
    'loading = true shows CircularProgressIndicator. When data arrives, loading = false and the list is shown with name and email.',
    'The INTERNET permission is compulsory in the manifest, otherwise the call fails.',
  ],
}
