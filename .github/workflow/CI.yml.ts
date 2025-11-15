<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tactical CI Commander</title>
    <link rel="stylesheet" href="style.css">
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/feather-icons/dist/feather.min.js"></script>
    <script src="https://unpkg.com/feather-icons"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              primary: '#3b82f6',
              secondary: '#10b981',
            }
          }
        }
      }
    </script>
</head>
<body class="bg-gray-100 min-h-screen">
    <custom-header></custom-header>
    
    <main class="container mx-auto px-4 py-8">
        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <div class="p-6">
                <h1 class="text-3xl font-bold text-primary mb-4">Tactical CI Pipeline</h1>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Pipeline Status Card -->
                    <div class="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <div class="flex items-center mb-4">
                            <i data-feather="activity" class="text-secondary mr-2"></i>
                            <h2 class="text-xl font-semibold">Pipeline Status</h2>
                        </div>
                        <div class="space-y-4">
                            <div class="flex items-center">
                                <div class="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                                <span>Build and Test</span>
                                <span class="ml-auto text-sm text-gray-500">Passed</span>
                            </div>
                            <div class="flex items-center">
                                <div class="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                                <span>Vercel Deployment</span>
                                <span class="ml-auto text-sm text-gray-500">Success</span>
                            </div>
                        </div>
                    </div>

                    <!-- Recent Runs Card -->
                    <div class="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <div class="flex items-center mb-4">
                            <i data-feather="clock" class="text-secondary mr-2"></i>
                            <h2 class="text-xl font-semibold">Recent Runs</h2>
                        </div>
                        <div class="space-y-3">
                            <div class="flex items-center text-sm">
                                <span class="w-24">#42</span>
                                <span class="flex-1">Push to main</span>
                                <span class="text-green-500">✓</span>
                            </div>
                            <div class="flex items-center text-sm">
                                <span class="w-24">#41</span>
                                <span class="flex-1">PR #123</span>
                                <span class="text-green-500">✓</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Workflow Visualization -->
                <div class="mt-8">
                    <h2 class="text-xl font-semibold mb-4 flex items-center">
                        <i data-feather="git-merge" class="mr-2"></i>
                        Workflow Steps
                    </h2>
                    
                    <div class="relative">
                        <div class="absolute left-4 h-full w-0.5 bg-gray-200"></div>
                        
                        <div class="relative pl-12 pb-8">
                            <div class="flex items-start mb-6">
                                <div class="absolute left-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white">
                                    1
                                </div>
                                <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm w-full">
                                    <h3 class="font-medium">Checkout Code</h3>
                                    <p class="text-sm text-gray-600 mt-1">actions/checkout@v4</p>
                                </div>
                            </div>
                            
                            <div class="flex items-start mb-6">
                                <div class="absolute left-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white">
                                    2
                                </div>
                                <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm w-full">
                                    <h3 class="font-medium">Install Dependencies</h3>
                                    <p class="text-sm text-gray-600 mt-1">cmake, g++, SDL2 libraries</p>
                                </div>
                            </div>
                            
                            <div class="flex items-start mb-6">
                                <div class="absolute left-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white">
                                    3
                                </div>
                                <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm w-full">
                                    <h3 class="font-medium">Build Project</h3>
                                    <p class="text-sm text-gray-600 mt-1">CMake configuration and build</p>
                                </div>
                            </div>
                            
                            <div class="flex items-start">
                                <div class="absolute left-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white">
                                    4
                                </div>
                                <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm w-full">
                                    <h3 class="font-medium">Run Tests</h3>
                                    <p class="text-sm text-gray-600 mt-1">CTest with output on failure</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <custom-footer></custom-footer>

    <script src="components/header.js"></script>
    <script src="components/footer.js"></script>
    <script src="script.js"></script>
    <script>feather.replace();</script>
</body>
</html>
